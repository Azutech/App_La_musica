import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, LoginDto, TokenDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repository/user.repository';
import { TokenRepository } from './repository/token.repository';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async signup(dto: CreateUserDto) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.createUser(dto.email, hash);

    await this.createToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user,
    };
  }

  async findAll() {
    const allUsers = await this.userRepo.findAll();

    if (allUsers.length === 0) {
      return [];
    }
    return allUsers;
  }

  async findUser(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // if (!user.)

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
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

    // TODO: Send email with `code`
    console.log(`Verification code for ${email}: ${code}`);

    return token;
  }

  private generateRandomNumbers(): number {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit
  }
}
