import { HttpStatus, Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { DistributionRepository } from './repository/distribution.repository';
import { DistributionDto } from './dtos/distribution.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DistributionService {
  constructor(private distributionRepository: DistributionRepository) {}

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

  return createdDistributor;
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
