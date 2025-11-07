import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DistributionService } from './distribution.service';
import { CodeDto, DistributionDto, LoginDto } from './dtos/distribution.dto';

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
  @MessagePattern({ cmd: 'verify_distributor' })
  async verifyDistributor(loginData: CodeDto) {
    return this.distributionService.verification(loginData);
  }
  @MessagePattern({ cmd: 'resend_verification' })
  async resendVerification(email: string ) {
    return this.distributionService.resendVerification(email);
  }
}
