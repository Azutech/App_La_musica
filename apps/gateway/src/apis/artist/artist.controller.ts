import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ArtistService } from './artist.service';
import { ApplyArtistDto } from '../distributors/dto/artist.dto';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

    @UseGuards(JwtAuthGuard)
    @Post('apply')
    async applyForArtist(@Body() applyArtistDto: ApplyArtistDto, @Req() req: any, @Res() res: Response) {
        applyArtistDto.userId = req.user.userId;
      const id = await this.artistService.applyArtist(applyArtistDto);
      return res.status(HttpStatus.CREATED).json({message: 'Application submitted', applicationId: id});
  
    }
}
