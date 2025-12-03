import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DistributorUbo } from '@prisma/client';
import { DistributionUboI } from '../interface/distribution.interface';

@Injectable()
export class DistributionUboRepository {
  constructor(private prisma: PrismaService) {}

  async create(distributorData: DistributionUboI): Promise<DistributorUbo> {
    return this.prisma.distributorUbo.create({
      data: {
        distributorId: distributorData.distributorId,
        firstName: distributorData.firstName,
        lastName: distributorData.lastName,
        email: distributorData.email,
        phone: distributorData.phone,
        nationality: distributorData.nationality,
        idType: distributorData.idType,
        idNumber: distributorData.idNumber,
        idDocumentUrl: distributorData.idDocumentUrl,
        ownershipPercentage: distributorData.ownershipPercentage,
      },
    });
  }

  async findAll(): Promise<DistributorUbo[]> {
    return this.prisma.distributorUbo.findMany();
  }
  async findDistroUbos(distributorId: string): Promise<DistributorUbo[]> {
    return this.prisma.distributorUbo.findMany({
      where: { distributorId },
    });
  }

  async updateProfile(distributorId: string, dto: DistributionUboI) {
    return this.prisma.distributorUbo.update({
      where: { distributorId },
      data: dto,
    });
  }

  async findOne(distributorId: string): Promise<DistributorUbo | null> {
    return await this.prisma.distributorUbo.findFirst({
      where: { distributorId },
    });
  }
  async findByemail(email: string): Promise<DistributorUbo | null> {
    return await this.prisma.distributorUbo.findFirst({
      where: { email },
    });
  }
  async findByPhone(phone: string): Promise<DistributorUbo | null> {
    return await this.prisma.distributorUbo.findFirst({
      where: { phone },
    });
  }
}
