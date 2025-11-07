import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ArtistApplication, ApplicationStatus } from '@prisma/client';
import { ApplicationI } from '../interface/application.interface';

@Injectable()
export class ArtistApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(app: ApplicationI): Promise<ArtistApplication> {
    return this.prisma.artistApplication.create({
      data: {
        userId: app.userId,
        stageName: app.stageName,
        bio: app.bio,
        genre: app.genre,
      },
    });
  }

  async findUserAppsId(
    userId: string | { userId: string },
    status?: ApplicationStatus,
  ): Promise<ArtistApplication | null> {
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    return this.prisma.artistApplication.findFirst({ where });
  }

  async findAppId(userId: string): Promise<ArtistApplication | null> {
    return await this.prisma.artistApplication.findFirst({
      where: { id: userId },
    });
  }

  async findDistroId(
    distributorId: string | { userId: string },
    status?: ApplicationStatus,
  ): Promise<ArtistApplication | null> {
    const where: any = { distributorId };

    if (status) {
      where.status = status;
    }

    return this.prisma.artistApplication.findFirst({ where });
  }

  async updateStatus(
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<ArtistApplication> {
    return this.prisma.artistApplication.update({
      where: { id: applicationId },
      data: { status },
    });
  }
}
