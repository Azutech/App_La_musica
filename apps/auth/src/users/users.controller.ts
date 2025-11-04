import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CodeDto, CreateUserDto, LoginDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'auth_signup' })
  async signup(data: CreateUserDto) {
    return await this.usersService.signup(data);
  }
  @MessagePattern({ cmd: 'all_users' })
  async findAll() {
    return await this.usersService.findAll();
  }
  @MessagePattern({ cmd: 'login_users' })
  async login(loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }
  @MessagePattern({ cmd: 'user_dashboard' })
  async dashboard(userId: string) {
    return await this.usersService.dashboard(userId);
  }
  @MessagePattern({ cmd: 'user_verification' })
  async verification(codeDto: CodeDto) {
    return await this.usersService.verification(codeDto);
  }
  @MessagePattern({ cmd: 'resend_verification' })
  async resendVerification(email: string) {
    return await this.usersService.resendVerification(email);
  }
}
