import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DistributionService } from './distribution.service';
import { DistributionDto } from './dtos/distribution.dto';

@Controller('distribution')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @MessagePattern({ cmd: 'add_distributor' })
  async addDistributor(distributorData: DistributionDto) {
    return this.distributionService.addDistributor(distributorData);
  }
}
