import { Module } from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { DistributionController } from './distribution.controller';
import { DistributionRepository } from './repository/distribution.repository';
import { PrismaService } from 'prisma/prisma.service';
import { TokenRepository } from './repository/token.repository';
import { DistributionProfileRepository } from './repository/distributionProfile.repository';

@Module({
  controllers: [DistributionController],
  providers: [
    DistributionService,
    PrismaService,
    DistributionRepository,
    DistributionProfileRepository,
    TokenRepository,
  ],
})
export class DistributionModule {}
