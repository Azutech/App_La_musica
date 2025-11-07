import { Module } from '@nestjs/common';
import { ArtistApplicationService } from './artist-application.service';
import { ArtistApplicationController } from './artist-application.controller';
import { ArtistApplicationRepository } from './repository/application.repository';
import { PrismaService } from 'prisma/prisma.service';
import { ArtistRepository } from 'src/artists/repository/artist.repository';

@Module({
  controllers: [ArtistApplicationController],
  providers: [
    ArtistApplicationService,
    ArtistApplicationRepository,
    ArtistRepository,
    PrismaService,
  ],
})
export class ArtistApplicationModule {}
