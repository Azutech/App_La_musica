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
import { Response } from 'express';
import { ArtistService } from './artist.service';
import { ApplyArtistDto } from '../distributors/dto/artist.dto';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/user.decorator';
import { UserRoles } from '../auth/enum/utils/enum.utils';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('applyDistro')
  async applyArtistviaDistro(
    @Body() applyArtistDto: ApplyArtistDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    applyArtistDto.distributorId = req.user.userId;
    const id = await this.artistService.applyArtistviaDistro(applyArtistDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Application submitted', applicationId: id });
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(UserRoles.RWX_ADMIN)
  @Get('viewApplication')
  async getApplicationByDistributorId(
    @Req() req: any,
    @Res() res: Response,
    @Query() applicationId: string,
  ) {
    const application =
      await this.artistService.getApplicationByDistributorId(applicationId);
    return res.status(HttpStatus.OK).json(application);
  }

  @UseGuards(JwtAuthGuard)
  @Put('approveApplication')
  async approveArtistApplication(
    @Req() req: any,
    @Res() res: Response,
    @Query('applicationId') applicationId: string,
  ) {
    const approvedApp =
      await this.artistService.approveArtistApplication(applicationId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Application approved', approvedApp });
  }
  @UseGuards(JwtAuthGuard)
  @Get('applications/allDistroApplications')
  async allDistroApplications(
    @Req() req: any,
    @Res() res: Response,
  ) {

    const distributorId = req.user.userId 
    const approvedApp =
      await this.artistService.allDistroApplications(distributorId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Application approved', approvedApp });
  }
  @UseGuards(JwtAuthGuard)
  @Get('applications/allDistroPendingApplications')
  async pendingDistroApplications(
    @Req() req: any,
    @Res() res: Response,
  ) {

    const distributorId = req.user.userId 
    const approvedApp =
      await this.artistService.pendingDistroApplications(distributorId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Application approved', approvedApp });
  }
  @UseGuards(JwtAuthGuard)
  @Get('applications/allDistroApprovedApplications')
  async approvedDistroApplications(
    @Req() req: any,
    @Res() res: Response,
  ) {

    const distributorId = req.user.userId 
    const approvedApp =
      await this.artistService.approvedDistroApplications(distributorId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Application approved', approvedApp });
  }
  @UseGuards(JwtAuthGuard)
  @Get('applications/allDistroRejectedApplications')
  async rejectedDistroApplications(
    @Req() req: any,
    @Res() res: Response,
  ) {

    const distributorId = req.user.userId 
    const approvedApp =
      await this.artistService.rejectedDistroApplications(distributorId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Application approved', approvedApp });
  }

  @UseGuards(JwtAuthGuard)
  @Put('rejectApplication')
  async rejectArtistApplication(
    @Req() req: any,
    @Res() res: Response,
    @Query('applicationId') applicationId: string,
  ) {
    const rejectedApp =
      await this.artistService.rejectArtistApplication(applicationId);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Application rejected', rejectedApp });
  }

  @UseGuards(JwtAuthGuard)
  @Get('approvedApplications')
  async getApprovedApplications(@Req() req: any, @Res() res: Response) {
    const applications = await this.artistService.getAllApprovedApplications();
    return res.status(HttpStatus.OK).json(applications);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pendingApplications')
  async getPendingApplications(@Req() req: any, @Res() res: Response) {
    const applications = await this.artistService.getAllPendingApplications();
    return res.status(HttpStatus.OK).json(applications);
  }
  @UseGuards(JwtAuthGuard)
  @Get('rejectedApplications')
  async getRejectedApplications(@Req() req: any, @Res() res: Response) {
    const applications = await this.artistService.getAllRejectedApplications();
    return res.status(HttpStatus.OK).json(applications);
  }
}
