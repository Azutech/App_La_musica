import { Module } from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { DistributionController } from './distribution.controller';
import { DistributionRepository } from './repository/distribution.repository';
import { PrismaService } from 'prisma/prisma.service';
import { TokenRepository } from './repository/token.repository';

@Module({
  controllers: [DistributionController],
  providers: [
    DistributionService,
    PrismaService,
    DistributionRepository,
    TokenRepository,
  ],
})
export class DistributionModule {}
