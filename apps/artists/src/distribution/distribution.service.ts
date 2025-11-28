import { HttpStatus, Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { DistributionRepository } from './repository/distribution.repository';
import {
  CodeDto,
  DistributionDto,
  DistributionProfileDto,
  LoginDto,
} from './dtos/distribution.dto';
import { RpcException } from '@nestjs/microservices';
import { BusinessType, Status } from './enum/enum.utils';
import * as moment from 'moment';
import { TokenRepository } from './repository/token.repository';
import { DistributionProfileRepository } from './repository/distributionProfile.repository';

@Injectable()
export class DistributionService {
  constructor(
    private distributionRepository: DistributionRepository,
    private distributionProfileRepository: DistributionProfileRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async addDistributor(distributorData: DistributionDto) {
    let { name, email, password, website } = distributorData;

    // Validate work email
    this.validateWorkEmail(email);

    const existingDistributor =
      await this.distributionRepository.findEmail(email);
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

    return { email: createdDistributor.email, token: token.code };
  }

  async dashboard(distributorId: string) {
    const user = await this.distributionRepository.findOne(distributorId);

    if (!user) {
      throw new RpcException({
        message: 'Distributor not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
    };
  }

  async findAllDistributors() {
    const distributors = await this.distributionRepository.findALLDistro();

    if (distributors.length === 0) {
      return [];
    }
    return distributors;
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

    return user.id;
  }

  async verification(codeDto: CodeDto) {
    const { code } = codeDto;
    const findUser = await this.tokenRepo.findTokenByCode(code);

    if (!findUser) {
      throw new RpcException({
        message: 'Verification Code is not Found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    if (moment().isAfter(findUser?.expiresAt)) {
      await this.tokenRepo.deleteTokenCode(code);

      throw new RpcException({
        message: 'Code has expired, please request another.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const verifyUser = await this.distributionRepository.update(
      findUser?.distributorId,
      {
        isActive: true,
        status: Status.ACTIVE,
      },
    );

    await this.tokenRepo.deleteTokenCode(code);

    const { password, ...user } = verifyUser;

    return {
      message: 'User verified successfully',
      user,
    };
  }

  async resendVerification(email: string) {
    const distro = await this.distributionRepository.findEmail(email);
    if (!distro) {
      throw new RpcException({
        message: 'Distributor not Found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const findUser = await this.tokenRepo.findByEmail(email);

    if (findUser) {
      await this.tokenRepo.deleteTokenI(findUser.email);
    }

    let token = await this.createToken({
      distributorId: distro.id,
      email: distro.email,
    });

    return {
      token: token.code,
    };
  }

  async createdistroProfile(dto: DistributionProfileDto) {
    const { businessType } = dto;
    const user = await this.distributionRepository.findOne(dto.distributorId);

    if (!user) {
      throw new RpcException({
        message: 'Distributor not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    const checkDistro = await this.distributionProfileRepository.findOne(
      dto.distributorId,
    );

    if (checkDistro) {
      throw new RpcException({
        message: 'Distributor already created profile',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const validReport = Object.values(BusinessType);
    if (!validReport.includes(businessType as BusinessType)) {
      throw new RpcException({
        message: `Invalid report type. Must be one of: [${validReport.join(', ')}]`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const [legalNameConflict, regNumberConflict, taxIdConflict] = await Promise.all([
    dto.legalName
      ? this.distributionProfileRepository.findByLegalName(dto.legalName)
      : null,

    dto.registrationNumber
      ? this.distributionProfileRepository.findByRegistrationNumber(dto.registrationNumber)
      : null,

    dto.taxId
      ? this.distributionProfileRepository.findByTaxId(dto.taxId)
      : null,
  ]);

  // 3. Build conflict message
  const conflicts: string[] = [];
  if (legalNameConflict) conflicts.push('Legal name');
  if (regNumberConflict) conflicts.push('Registration number');
  if (taxIdConflict) conflicts.push('Tax ID');

  if (conflicts.length > 0) {
    throw new RpcException({
      message: `${conflicts.join(', ')} already in use by another distributor`,
      statusCode: HttpStatus.CONFLICT,
      data: { conflicts },
    });
  }

    const profileData: DistributionProfileDto = {
      distributorId: dto.distributorId,
      legalName: dto.legalName,
      businessType: dto.businessType,
      registrationNumber: dto.registrationNumber,
      taxId: dto.taxId,
      country: dto.country,
      state: dto.state,
      city: dto.city,
      address: dto.address,
      website: dto.website,
      verificationScore: dto.verificationScore ?? 0, // default if not provided
    };

    const addProfile =
      await this.distributionProfileRepository.create(profileData);

    return addProfile;
  }

  async viewProfile(distributorId: string) {
    const existing =
      await this.distributionProfileRepository.findOne(distributorId);
    if (!existing) {
      throw new RpcException({
        message: 'Distributor not Found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return existing;
  }

  async updateProfile(dto: DistributionProfileDto) {
    const { businessType } = dto;
    const existing = await this.distributionProfileRepository.findOne(
      dto.distributorId,
    );
    if (!existing) {
      throw new RpcException({
        message: 'Distributor not Found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const validReport = Object.values(BusinessType);
    if (!validReport.includes(businessType as BusinessType)) {
      throw new RpcException({
        message: `Invalid report type. Must be one of: [${validReport.join(', ')}]`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const newProfile = await this.distributionProfileRepository.updateProfile(
      existing.distributorId,
      dto,
    );

    return newProfile;
  }

  private async createToken(tokenDto: {
    distributorId: string;
    email: string;
  }) {
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
        message:
          'Please use a work email address. Personal email providers are not allowed.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
