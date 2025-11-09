import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DistributionService } from './distribution.service';
import { CodeDto, DistributionDto, LoginDto } from './dtos/distribution.dto';

@Controller('distribution')
export class DistributionController {
  constructor(private readonly distributionService: DistributionService) {}

  @MessagePattern({ cmd: 'add_distributor' })
  async addDistributor(distributorData: DistributionDto) {
    return await this.distributionService.addDistributor(distributorData);
  }

  @MessagePattern({ cmd: 'login_distributor' })
  async loginDistributor(loginData: LoginDto) {
    return await this.distributionService.login(loginData);
  }
  @MessagePattern({ cmd: 'verify_distributor' })
  async verifyDistributor(loginData: CodeDto) {
    return await this.distributionService.verification(loginData);
  }
  @MessagePattern({ cmd: 'resend_verification' })
  async resendVerification(email: string) {
    return await this.distributionService.resendVerification(email);
  }

  @MessagePattern({ cmd: 'distributor_dashboard' })
  async getDistributor(@Payload() payload: { distributorId: string }) {
    const { distributorId } = payload;

    return await this.distributionService.dashboard(distributorId);
  }
  @MessagePattern({ cmd: 'distributor_list' })
  async getAllDistributors() {
    return await this.distributionService.findAllDistributors();
  }
}
