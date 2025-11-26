import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ArtistApplication, ApplicationStatus } from '@prisma/client';
import { ApplicationI } from '../interface/application.interface';

@Injectable()
export class ArtistApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createApplication(app: ApplicationI): Promise<ArtistApplication> {
    const data: any = {
      stageName: app.stageName,
      bio: app.bio,
      genre: app.genre,
    };

    // Only include whichever exists
    if (app.userId) data.userId = app.userId;
    if (app.distributorId) data.distributorId = app.distributorId;

    return this.prisma.artistApplication.create({ data });
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

  async findAppId(id: string): Promise<ArtistApplication | null> {
    return await this.prisma.artistApplication.findFirst({
      where: { id },
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

  async findAll(): Promise<ArtistApplication[]> {
    return this.prisma.artistApplication.findMany();
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
