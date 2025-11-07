import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  Put,
  UseFilters,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto, CreateUserDto, CodeDto, OnboardUserDto } from './dtos/auth.dto';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';
// import { RpcExceptionFilter } from 'src/common/filters/rpc-exception.filter';

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
    const id = await this.authService.user_dashboard(userId);
    return res.json(id);
  }

  @Put('verification')
  async verification(@Body() codeDto: CodeDto, @Res() res: Response) {
    const verification = await this.authService.verification(codeDto);
    return res.status(HttpStatus.OK).json(verification);
  }

  @UseGuards(JwtAuthGuard)
  @Put('onboard_user')
  async onboard_user(@Body() onboardUserDto: OnboardUserDto, @Req() req: any, @Res() res: Response) {
    onboardUserDto.userId = req.user.userId;
    const onboard = await this.authService.onboard_user(onboardUserDto);
    return res.status(HttpStatus.OK).json(onboard);
  }

  @Put('resend_verification')
  async resend_verification(
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    const verification = await this.authService.resend_verification(email);
    return res.status(HttpStatus.OK).json(verification);
  }
}
