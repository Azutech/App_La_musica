import { Controller } from '@nestjs/common';
import { ArtistApplicationService } from './artist-application.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
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

  @MessagePattern({ cmd: 'artist_get_application' })
  async getUserApplication(@Payload() payload: { applicationId: string }) {
    return await this.artistApplicationService.getApplicationId(
      payload.applicationId,
    );
  }
  @MessagePattern({ cmd: 'pending_application' })
  async pendingApplication() {
    return await this.artistApplicationService.findAllPendingApplications();
  }
  @MessagePattern({ cmd: 'approved_application' })
  async approvedApplications() {
    return await this.artistApplicationService.findApprovedAllApplications();
  }
  @MessagePattern({ cmd: 'rejected_application' })
  async rejectedApplications() {
    return await this.artistApplicationService.findRejectedAllApplications();
  }

  @MessagePattern({ cmd: 'approve_application' })
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
  @MessagePattern({ cmd: 'distro_application' })
  async distroApplications(distributorId: string) {
    return await this.artistApplicationService.distroApplications(
      distributorId,
    );
  }
  @MessagePattern({ cmd: 'distro_rejected_application' })
  async distroRejectedApplications(distributorId: string) {
    return await this.artistApplicationService.distroRejectedApplications(
      distributorId,
    );
  }
  @MessagePattern({ cmd: 'distro_approved_application' })
  async distroApprovedApplications(distributorId: string) {
    return await this.artistApplicationService.distroApprovedApplications(
      distributorId,
    );
  }
  @MessagePattern({ cmd: 'distro_pending_application' })
  async distroPendingApplications(distributorId: string) {
    return await this.artistApplicationService.distroPendingApplications(
      distributorId,
    );
  }
  @MessagePattern({ cmd: 'all_artist_application' })
  async allApplication(distributorId: string) {
    return await this.artistApplicationService.rejectArtistApplicationViaDistributor(
      distributorId,
    );
  }
}
