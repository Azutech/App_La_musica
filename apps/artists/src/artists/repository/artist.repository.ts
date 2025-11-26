import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createArtist(
    stageName: string,
    bio: string,
    genre: string,
    distributorId?: string,
  ): Promise<Artist> {
    return this.prisma.artist.create({
      data: {
        stageName,
        bio,
        genre,
        distributorId,
      },
    });
  }
}
