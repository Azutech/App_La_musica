import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import {
  CodeDto,
  CreateUserDto,
  LoginDto,
  OnboardUserDto,
  TokenDto,
} from './dto/user.dto';
import { RpcException } from '@nestjs/microservices';
import { hashSync, genSaltSync, compareSync, hash } from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { TokenRepository } from './repository/token.repository';
import * as moment from 'moment';
import { Status } from './utils/enum/util.enum';
import { generateSecureCode, getExpiresAt } from 'src/common/utils/token.utils';

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async signup(dto: CreateUserDto) {
    let { email, password } = dto;
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new RpcException({
        message: 'Email already exists',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const hashed = await hash(password, 8); // async
    const user = await this.userRepo.createUser(email, hashed);

    let token = await this.createToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      token: token.code,
    };
  }

  async findAll() {
    const allUsers = await this.userRepo.findAll();

    if (allUsers.length === 0) {
      return [];
    }
    const setuser = allUsers.map(({ password, ...user }) => user);
    return {
      message: 'user returned',
      setuser,
    };
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

    const verifyUser = await this.userRepo.updateUser(findUser?.userId, {
      isActive: true,
      status: Status.ACTIVE,
    });

    await this.tokenRepo.deleteTokenCode(code);

    const { password, ...user } = verifyUser;

    return {
      message: 'User verified successfully',
      user,
    };
  }

  async onboardUser(OnboardUserDto: OnboardUserDto) {
    const { firstName, lastName, userId } = OnboardUserDto;

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new RpcException({
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    await this.userRepo.updateUser(userId, {
      firstName,
      lastName,
    });

    return {
      message: 'User onboarded successfully',
    };
  }

  async resendVerification(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new RpcException({
        message: 'User not Found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const findUser = await this.tokenRepo.findByEmail(email);

    if (findUser) {
      await this.tokenRepo.deleteTokenI(findUser.email);
    }

    let token = await this.createToken({
      userId: user.id,
      email: user.email,
    });

    return {
      token: token.code,
    };
  }

  async dashboard(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.userRepo.findByEmail(email);
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

  private async createToken(tokenDto: { userId: string; email: string }) {
    const { userId, email } = tokenDto;

    const code = generateSecureCode();
    const expiresAt = getExpiresAt();

    const token = await this.tokenRepo.createToken(
      userId,
      email,
      code,
      expiresAt,
    );
    return token;
  }

  private generateRandomNumbers(): number {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit
  }
}
