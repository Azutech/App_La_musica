import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DistributionService } from './distribution.service';
import { DistributionDto, LoginDto } from './dtos/distribution.dto';

@Controller('distribution')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @MessagePattern({ cmd: 'add_distributor' })
  async addDistributor(distributorData: DistributionDto) {
    return this.distributionService.addDistributor(distributorData);
  }

  @MessagePattern({ cmd: 'login_distributor' })
  async loginDistributor(loginData: LoginDto) {
    return this.distributionService.login(loginData);
  }
}
