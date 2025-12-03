import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DistributorService } from './distributors.service';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';
import {
  ApplyArtistDto,
  DistributionDto,
  DistributionProfileDto,
  DistributionUboDto,
  LoginDto,
} from './dto/artist.dto';
import { Response } from 'express';
import { CodeDto } from 'src/apis/auth/dtos/auth.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/user.decorator';
import { UserRoles } from '../auth/enum/utils/enum.utils';

@Controller('distro')
export class ArtistController {
  constructor(private readonly distributorService: DistributorService) {}

  @Post('add-distributor')
  async addDistributor(
    @Body() distributionDto: DistributionDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const id = await this.distributorService.addDistributor(distributionDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Distributor registered', applicationId: id });
  }
  @Post('login-distributor')
  async loginDistributor(
    @Body() loginDto: LoginDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const id = await this.distributorService.loginDistributor(loginDto);
    return res.json(id);
  }
  @Put('resend-verification')
  async resendVerification(
    @Query('email') email: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const id = await this.distributorService.resendVerification(email);
    return res.json(id);
  }
  @Put('verify-distributor')
  async verifyDistributor(
    @Body() codeDto: CodeDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const id = await this.distributorService.verifyDistributor(codeDto);
    return res.json(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('distributor-dashboard')
  async distributorDashboard(@Req() req: any, @Res() res: Response) {
    const userId = req.user.userId;
    const id = await this.distributorService.dashboard(userId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Dashboard data retrieved successfully', data: id });
  }
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.RWX_ADMIN)
  @Get('distributor-list')
  async distributorList(@Req() req: any, @Res() res: Response) {
    const id = await this.distributorService.getAllDistributors();
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Distributor list retrieved successfully', data: id });
  }
  @UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  async updateProfile(
    @Req() req: any,
    @Res() res: Response,
    @Body() distributionProfileDto: DistributionProfileDto,
  ) {
    distributionProfileDto.distributorId = req.user.userId;
    const id = await this.distributorService.updateProfile(
      distributionProfileDto,
    );
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Profile added successfully', data: id });
  }
  @UseGuards(JwtAuthGuard)
  @Post('addProfile')
  async addProfile(
    @Req() req: any,
    @Res() res: Response,
    @Body() distributionProfileDto: DistributionProfileDto,
  ) {
    distributionProfileDto.distributorId = req.user.userId;
    const id = await this.distributorService.addProfile(distributionProfileDto);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Profile updated successfully', data: id });
  }
  @UseGuards(JwtAuthGuard)
  @Get('view-Profile')
  async viewProfile(@Req() req: any, @Res() res: Response) {
    const distributionId = req.user.userId;
    const id = await this.distributorService.viewProfile(distributionId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Profile User view successfully', data: id });
  }
  @UseGuards(JwtAuthGuard)
  @Get('view-DistroUbo')
  async viewdistroUbo(@Req() req: any, @Res() res: Response) {
    const distributionId = req.user.userId;
    const id = await this.distributorService.viewdistroUbo(distributionId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'User Ubo view successfully', data: id });
  }

  @UseGuards(JwtAuthGuard)
  @Post('createdistroUbo')
  async createdistroUbo(
    @Req() req: any,
    @Res() res: Response,
    @Body() distributionUboDto: DistributionUboDto,
  ) {
    distributionUboDto.distributorId = req.user.userId;
    const id =
      await this.distributorService.createdistroUbo(distributionUboDto);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Profile updated successfully', data: id });
  }
}
