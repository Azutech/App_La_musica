import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Distributor } from '@prisma/client';


@Injectable()
export class DistributionRepository {
  constructor(private prisma: PrismaService) {}

  async create(distributorData: Distributor): Promise<Distributor> {
    return this.prisma.distributor.create({ data: distributorData });
  }

  async findAll(): Promise<Distributor[]> {
    return this.prisma.distributor.findMany();
  }

  async findOne(id: string): Promise<Distributor | null> {
    return this.prisma.distributor.findUnique({ where: { id } });
  }

  async update(id: string, distributorData: Distributor): Promise<Distributor> {
    return this.prisma.distributor.update({
      where: { id },
      data: distributorData,
    });
  }

  async delete(id: string): Promise<Distributor> {
    return this.prisma.distributor.delete({ where: { id } });
  }
}
