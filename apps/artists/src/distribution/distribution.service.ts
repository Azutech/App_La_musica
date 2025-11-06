import { HttpStatus, Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { DistributionRepository } from './repository/distribution.repository';
import { DistributionDto, LoginDto } from './dtos/distribution.dto';
import { RpcException } from '@nestjs/microservices';
import { Status } from './enum/enum.utils';
import * as moment from 'moment';
import { TokenRepository } from './repository/token.repository';

@Injectable()
export class DistributionService {
  constructor(private distributionRepository: DistributionRepository, private tokenRepo: TokenRepository) {}

async addDistributor(distributorData: DistributionDto) {
  let { name, email, password, website } = distributorData;

  // Validate work email
  this.validateWorkEmail(email);

  const existingDistributor = await this.distributionRepository.findEmail(email);
  if (existingDistributor) {
    throw new RpcException({
      message: 'Distributor with this email already exists',
      statusCode: HttpStatus.CONFLICT,
    });
  }

  password = hashSync(password, genSaltSync());

  const createdDistributor = await this.distributionRepository.create({
    name: name,
    email: email,
    password: password,
    website: website,
  });

    let token = await this.createToken({
      distributorId: createdDistributor.id,
      email: createdDistributor.email,
    });

  return {createdDistributor, token};
}


  async dashboard(distributorId: string) {
    const user = await this.distributionRepository.findOne(distributorId);

    if (!user) {
      throw new RpcException({message : 'Distributor not found', statusCode: HttpStatus.NOT_FOUND  });
    }

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.distributionRepository.findEmail(email);
    if (!user) {
      throw new RpcException({
        message: 'User not Found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const inactiveStatuses = [Status.PENDING, Status.SUSPENDED];

    if (inactiveStatuses.includes(user?.status as Status)) {
      const messages = {
        [Status.PENDING]: 'Please verify your email before logging in',
        [Status.SUSPENDED]: 'Your account has been suspended',
      };

      // Final clean version
      throw new RpcException({
        message: messages[user.status],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const isMatch = await compareSync(password, user?.password);
    if (!isMatch) throw new RpcException('Invalid credentials');

    return user.id
  }

    private async createToken(tokenDto: { distributorId: string; email: string }) {
    const { distributorId, email } = tokenDto;

    const code = this.generateRandomNumbers();
    const expiresAt = moment().add(15, 'minutes').toDate();

    const token = await this.tokenRepo.createToken(
      distributorId,
      email,
      code,
      expiresAt,
    );
    return token;
  }

  private generateRandomNumbers(): number {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit
  }

private validateWorkEmail(email: string): void {
  // Check if email exists and is not empty
  if (!email || email.trim() === '') {
    throw new RpcException({
      message: 'Email is required',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new RpcException({
      message: 'Invalid email format',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }


  

  const freeEmailProviders = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
    'zoho.com',
    'yandex.com',
    'gmx.com',
    'inbox.com',
    'live.com',
    'msn.com',
  ];

  const emailDomain = email.toLowerCase().split('@')[1];

  // Check if domain exists
  if (!emailDomain) {
    throw new RpcException({
      message: 'Invalid email format',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }

  if (freeEmailProviders.includes(emailDomain)) {
    throw new RpcException({
      message: 'Please use a work email address. Personal email providers are not allowed.',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}
}
