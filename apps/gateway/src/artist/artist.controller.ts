import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { JwtAuthGuard } from 'src/guards/jwt/jwt.guard';
import { ApplyArtistDto } from './dto/artist.dto';
import { Response } from 'express';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async applyForArtist(@Body() applyArtistDto: ApplyArtistDto, @Req() req: any, @Res() res: Response) {
      applyArtistDto.userId = req.user.userId;
    const id = await this.artistService.applyArtist(applyArtistDto);
    return res.json(id);

  }
}
