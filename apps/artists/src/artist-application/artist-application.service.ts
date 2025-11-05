import { Injectable, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApplyArtistDto } from 'src/artist-application/dtos/applications.dto';
import { ArtistApplicationRepository } from 'src/artist-application/repository/application.repository';

@Injectable()
export class ArtistApplicationService {
  constructor(
    private appRepo: ArtistApplicationRepository,
    // private authClient: ClientProxy,
  ) {}

  async apply(dto: ApplyArtistDto) {
    const applyArtist = await this.appRepo.findUserAppsId(dto.userId);
    if (applyArtist) {
      throw new RpcException({
        message: 'Applications already created',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const createApp = await this.appRepo.createUser({
      userId: dto.userId,
      stageName: dto.stageName,
      bio: dto.bio,
      genre: dto.genre,
    });

    return createApp;
  }
}
