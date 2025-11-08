import { Controller } from '@nestjs/common';
import { ArtistApplicationService } from './artist-application.service';
import { MessagePattern } from '@nestjs/microservices';
import { ApplyArtistDto } from './dtos/applications.dto';

@Controller('artist-application')
export class ArtistApplicationController {
  constructor(
    private readonly artistApplicationService: ArtistApplicationService,
  ) {}

  @MessagePattern({ cmd: 'artist_apply_user' })
  async applyViaUser(data: ApplyArtistDto) {
    return await this.artistApplicationService.applyViaUser(data);
  }
  @MessagePattern({ cmd: 'artist_apply_distributor' })
  async applyViaDistributor(data: ApplyArtistDto) {
    return await this.artistApplicationService.applyViaDistributor(data);
  }
  @MessagePattern({ cmd: 'artist_get_distributor_application' })
  async getDistributorApplication(distributorId: string) {
    return await this.artistApplicationService.getApplicationByDistributorId(
      distributorId,
    );
  }
  @MessagePattern({ cmd: 'artist_get_user_application ' })
  async getUserApplication(distributorId: string) {
    return await this.artistApplicationService.getApplicationByUserId(distributorId);
  }

  @MessagePattern({ cmd: 'artist_approve_application_via_distributor' })
  async approveArtistApplicationViaDistributor(applicationId: string) {
    return await this.artistApplicationService.approveArtistApplicationViaDistributor(
      applicationId,
    );
  }

  @MessagePattern({ cmd: 'artist_approve_application_via_user' })
  async approveArtistApplicationViaUser(applicationId: string) {
    return await this.artistApplicationService.approveArtistApplicationViaUser(
      applicationId,
    );
  }

  @MessagePattern({ cmd: 'artist_reject_application' })
  async rejectApplication(applicationId: string) {
    return await this.artistApplicationService.rejectArtistApplicationViaDistributor(
      applicationId,
    );
  }   
}
