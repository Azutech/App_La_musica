import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Distributor } from '@prisma/client';
import { DistributionI } from '../interface/distribution.interface';

@Injectable()
export class DistributionRepository {
  constructor(private prisma: PrismaService) {}

  async create(distributorData: DistributionI): Promise<Distributor> {
    return this.prisma.distributor.create({
      data: {
        email: distributorData.email,
        password: distributorData.password,
        avatar: distributorData.avatar,
      },
    });
  }

  async findAll(): Promise<Distributor[]> {
    return this.prisma.distributor.findMany();
  }

  async findOne(id: string): Promise<Distributor | null> {
    return await this.prisma.distributor.findFirst({ where: { id } });
  }
  async findEmail(email: string): Promise<Distributor | null> {
    return await this.prisma.distributor.findFirst({ where: { email } });
  }
  async findALLDistro(): Promise<Distributor[]> {
    return await this.prisma.distributor.findMany();
  }

  async update(id: string, distributorData: any): Promise<Distributor> {
    return this.prisma.distributor.update({
      where: { id },
      data: distributorData,
    });
  }

  async delete(id: string): Promise<Distributor> {
    return this.prisma.distributor.delete({ where: { id } });
  }
}
