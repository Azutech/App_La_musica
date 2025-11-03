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
import { CreateUserDto } from './dto/user.dto';

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
}
