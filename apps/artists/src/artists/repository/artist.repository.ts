import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createArtist(data: {
    userId: string;
    stageName: string;
    bio: string;
    genre: string;
  }): Promise<Artist> {
    return this.prisma.artist.create({
      data: {
        userId: data.userId,
        stageName: data.stageName,
        bio: data.bio,
        genre: data.genre,
        isActive: true,
      },
    });
  }

  async findArtistByUserId(userId: string): Promise<Artist | null> {
    return this.prisma.artist.findUnique({
      where: { userId },
    });
  }
}