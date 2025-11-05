import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ArtistApplication } from '@prisma/client';
import { ApplicationI } from '../interface/application.interface';
import { ApplicationStatus } from '../enums/enum.util';

@Injectable()
export class ArtistApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(app: ApplicationI): Promise<ArtistApplication> {
    return this.prisma.artistApplication.create({
      data: app,
    });
  }

  async findUserAppsId(
    userId: string,
    status?: ApplicationStatus,
  ): Promise<ArtistApplication | null> {
    const where: any = { userId };

    if (status) {
      where.status = status; // Direct assignment
    }

    return this.prisma.artistApplication.findFirst({ where });
  }
}
