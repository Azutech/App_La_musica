import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Distributor, DistributorDocument } from '@prisma/client';
import {
  DistributionDocumentI,
  DistributionI,
} from '../interface/distribution.interface';

@Injectable()
export class DistributionDocumentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    distributorData: DistributionDocumentI,
  ): Promise<DistributorDocument> {
    return this.prisma.distributorDocument.create({
      data: {
        distributorId: distributorData.distributorId,
        docType: distributorData.docType,
        docUrl: distributorData.docUrl,
        docHash: distributorData.docHash,
        mimeType: distributorData.mimeType,
        size: distributorData.size,
      },
    });
  }

  async findAll(): Promise<DistributorDocument[]> {
    return this.prisma.distributorDocument.findMany();
  }

  async findOne(id: string): Promise<DistributorDocument | null> {
    return await this.prisma.distributorDocument.findFirst({ where: { id } });
  }

  async findALLDocuments(): Promise<DistributorDocument[]> {
    return await this.prisma.distributorDocument.findMany();
  }

  async delete(id: string): Promise<DistributorDocument> {
    return this.prisma.distributorDocument.delete({ where: { id } });
  }
}
