import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepo: UserRepository, ) {}

  async signup(dto: CreateUserDto) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already exists');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.createUser(dto.email, hash);

    // return this.signToken(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  }

}
