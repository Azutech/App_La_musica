import { Controller } from '@nestjs/common';
import { ArtistApplicationService } from './artist-application.service';
import { MessagePattern } from '@nestjs/microservices';
import { ApplyArtistDto } from './dtos/applications.dto';

@Controller('artist-application')
export class ArtistApplicationController {
  constructor(
    private readonly artistApplicationService: ArtistApplicationService,
  ) {}

  @MessagePattern({ cmd: 'artist_apply_distributor' })
  async applyViaDistributor(data: ApplyArtistDto) {
    return await this.artistApplicationService.applyViaDistributor(data);
  }

  @MessagePattern({ cmd: 'artist_get_application ' })
  async getUserApplication(applicationId: string) {
    return await this.artistApplicationService.getApplicationId(applicationId);
  }
  @MessagePattern({ cmd: 'pending_application ' })
  async pendingApplication() {
    return await this.artistApplicationService.findAllPendingApplications();
  }
  @MessagePattern({ cmd: 'approved_application ' })
  async approvedApplications() {
    return await this.artistApplicationService.findApprovedAllApplications();
  }
  @MessagePattern({ cmd: 'rejected_application ' })
  async rejectedApplications() {
    return await this.artistApplicationService.findRejectedAllApplications();
  }

  @MessagePattern({ cmd: 'artist_approve_application_via_distributor' })
  async approveArtistApplicationViaDistributor(applicationId: string) {
    return await this.artistApplicationService.approveArtistApplicationViaDistributor(
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
