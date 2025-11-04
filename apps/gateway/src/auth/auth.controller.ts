import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto, CreateUserDto, CodeDto } from './dtos/auth.dto';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() loginDto: CreateUserDto) {
    return await this.authService.signup(loginDto);
  }
  @Get('users')
  async allUsers(@Res() res: Response) {
    const users = await this.authService.allUsers();
    return res.json(users); // ← Send JSON
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const login = await this.authService.login(loginDto);
    return res.json(login);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async dashboard(@Req() req: any, @Res() res: Response) {
    const userId = req.user.userId;
    return this.authService.user_dashboard(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('verification')
  async verification(@Body() codeDto: CodeDto, @Res() res: Response) {
    return this.authService.verification(codeDto);
  }
}
