import { Controller } from '@nestjs/common';
import { ArtistApplicationService } from './artist-application.service';
import { MessagePattern } from '@nestjs/microservices';
import { ApplyArtistDto } from './dtos/applications.dto';

@Controller('artist-application')
export class ArtistApplicationController {
  constructor(
    private readonly artistApplicationService: ArtistApplicationService,
  ) {}


  @MessagePattern({ cmd: 'artist_apply' })
  async apply(data: ApplyArtistDto) {
    return await this.artistApplicationService.apply(data);
  }
}
