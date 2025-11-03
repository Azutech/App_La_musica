import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string }) {
    return await this.authService.signup(body.email, body.password);
  }
  @Get('users')
  async allUsers(@Res() res: Response) {
    const users = await this.authService.allUsers();
    return res.json(users); // ← Send JSON
  }

  // @Post('login')
  // async login(@Body() body: { email: string; password: string }) {
  //   return this.authService.login(body.email, body.password);
  // }
}
