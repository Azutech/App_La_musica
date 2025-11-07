import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  CodeDto,
  CreateUserDto,
  LoginDto,
  OnboardUserDto,
} from './dto/user.dto';

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
  async dashboard(@Payload() payload: { userId: string }) {
    const { userId } = payload;
    return this.usersService.dashboard(userId); // ← now a string
  }
  @MessagePattern({ cmd: 'user_verification' })
  async verification(codeDto: CodeDto) {
    return await this.usersService.verification(codeDto);
  }
  @MessagePattern({ cmd: 'resend_verification' })
  async resendVerification(email: string) {
    return await this.usersService.resendVerification(email);
  }
  @MessagePattern({ cmd: 'onboard_user' })
  async onboardUser(OnboardUserDto: OnboardUserDto) {
    return await this.usersService.onboardUser(OnboardUserDto);
  }
  @MessagePattern({ cmd: 'update_role' })
  async updateRole(userId: string) {
    return await this.usersService.updateRole(userId);
  }
}
