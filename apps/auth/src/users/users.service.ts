import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CodeDto, CreateUserDto, LoginDto, TokenDto } from './dto/user.dto';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { TokenRepository } from './repository/token.repository';
import * as moment from 'moment';
import { Status } from './utils/enum/util.enum';
import { console } from 'inspector';

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async signup(dto: CreateUserDto) {
    const existing = await this.userRepo.findByEmail(dto.email);
    console.log("pass",existing)
    if (existing) {
    throw new RpcException({ message: 'Email already exists', statusCode: HttpStatus.CONFLICT });
  
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.createUser(dto.email, hash);

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
      throw new BadRequestException('Verification Code is not Found');
    }

    if (moment().isAfter(findUser?.expiresAt)) {
      await this.tokenRepo.deleteTokenCode(code);

      throw new HttpException(
        'Code has expired, please request another.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const verifyUser = await this.userRepo.updateUser(findUser?.email, {
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

  async dashboard(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const inactiveStatuses = [Status.PENDING, Status.SUSPENDED];

    if (inactiveStatuses.includes(user?.status as Status)) {
      const messages = {
        [Status.PENDING]: 'Please verify your email before logging in',
        [Status.SUSPENDED]: 'Your account has been suspended',
      };

// Final clean version
throw new RpcException(new BadRequestException('Please verify your email'));    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return {
      userId: user.id,
    };
  }

  private async createToken(tokenDto: { userId: string; email: string }) {
    const { userId, email } = tokenDto;

    const code = this.generateRandomNumbers();
    const expiresAt = moment().add(15, 'minutes').toDate();

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
