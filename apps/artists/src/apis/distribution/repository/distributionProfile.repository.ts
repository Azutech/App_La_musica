import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DistributorProfile } from '@prisma/client';
import { DistributionProfileI } from '../interface/distribution.interface';

@Injectable()
export class DistributionProfileRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    distributorData: DistributionProfileI,
  ): Promise<DistributorProfile> {
    return this.prisma.distributorProfile.create({
      data: {
        distributorId: distributorData.distributorId,
        legalName: distributorData.legalName,
        businessType: distributorData.businessType,
        registrationNumber: distributorData.registrationNumber,
        taxId: distributorData.taxId,
        country: distributorData.country,
        state: distributorData.state,
        city: distributorData.city,
        address: distributorData.address,
        website: distributorData.website,
      },
    });
  }

  async findAll(): Promise<DistributorProfile[]> {
    return this.prisma.distributorProfile.findMany();
  }

  async updateProfile(distributorId: string, dto: DistributionProfileI) {
    return this.prisma.distributorProfile.update({
      where: { distributorId },
      data: dto,
    });
  }

  async findOne(distributorId: string): Promise<DistributorProfile | null> {
    return await this.prisma.distributorProfile.findFirst({
      where: { distributorId },
    });
  }
  async findByLegalName(legalName: string): Promise<DistributorProfile | null> {
    return await this.prisma.distributorProfile.findFirst({
      where: { legalName },
    });
  }
  async findByRegistrationNumber(
    registrationNumber: string,
  ): Promise<DistributorProfile | null> {
    return await this.prisma.distributorProfile.findFirst({
      where: { registrationNumber },
    });
  }
  async findByTaxId(taxId: string): Promise<DistributorProfile | null> {
    return await this.prisma.distributorProfile.findFirst({
      where: { taxId },
    });
  }
}
