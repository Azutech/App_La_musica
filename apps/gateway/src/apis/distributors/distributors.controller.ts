import { Body, Controller, Get, HttpStatus, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { DistributorService } from './distributors.service';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';
import { ApplyArtistDto, DistributionDto, LoginDto } from './dto/artist.dto';
import { Response } from 'express';
import { CodeDto } from 'src/apis/auth/dtos/auth.dto';

@Controller('distro')
export class ArtistController {
  constructor(private readonly distributorService: DistributorService) {}


  @Post('add-distributor')
  async addDistributor(@Body() distributionDto: DistributionDto, @Req() req: any, @Res() res: Response) {
    const id = await this.distributorService.addDistributor(distributionDto  );
    return res.status(HttpStatus.CREATED).json({message: 'Distributor registered', applicationId: id});

  }
  @Post('login-distributor')
  async loginDistributor(@Body() loginDto: LoginDto, @Req() req: any, @Res() res: Response) {
    const id = await this.distributorService.loginDistributor(loginDto);
    return res.json(id);
  }
  @Put('resend-verification')
  async resendVerification(@Query('email') email: string, @Req() req: any, @Res() res: Response) {
    const id = await this.distributorService.resendVerification(email);
    return res.json(id);
  }
  @Put('verify-distributor')
  async verifyDistributor(@Body() codeDto: CodeDto, @Req() req: any, @Res() res: Response) {
    const id = await this.distributorService.verifyDistributor(codeDto);
    return res.json(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('distributor-dashboard')
  async distributorDashboard(@Req() req: any, @Res() res: Response) {
    const userId = req.user.userId;
    const id = await this.distributorService.dashboard(userId);
    return res.status(HttpStatus.OK).json({message : 'Dashboard data retrieved successfully', data: id});
  }
}
