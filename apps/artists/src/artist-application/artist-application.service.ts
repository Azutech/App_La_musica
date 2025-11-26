import { Injectable, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ApplyArtistDto } from 'src/artist-application/dtos/applications.dto';
import { ArtistApplicationRepository } from 'src/artist-application/repository/application.repository';
import { ApplicationStatus } from './enums/enum.util';
import { ArtistRepository } from 'src/artists/repository/artist.repository';
import { DistributionRepository } from 'src/distribution/repository/distribution.repository';

@Injectable()
export class ArtistApplicationService {
  constructor(
    private appRepo: ArtistApplicationRepository,
    private distributionRepository: DistributionRepository,

    private artistRepo: ArtistRepository,
  ) {}

  async applyViaDistributor(dto: ApplyArtistDto) {
    const applyArtist = await this.appRepo.findDistroId(dto.distributorId);
    if (!applyArtist) {
      throw new RpcException({
        message: 'Distro not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const checkStageName = await this.appRepo.findStageName(dto.stageName);

    if (checkStageName) {
      throw new RpcException({
        message: 'Artist Name taken already',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const createApp = await this.appRepo.createApplication({
      distributorId: dto.distributorId,
      stageName: dto.stageName,
      bio: dto.bio,
      genre: dto.genre,
    });

    return createApp;
  }
  async getApplicationId(applicationId: string) {
    const application = await this.appRepo.findAppId(applicationId);
    if (!application) {
      throw new RpcException({
        message: 'Application not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return application;
  }

  async findAllPendingApplications() {
    const applications = await this.appRepo.findAll();

    if (applications.length === 0) {
      return [];
    }

    const pendingApplications = applications.filter(
      (app) => app.status === ApplicationStatus.PENDING,
    );

    return pendingApplications;
  }

  async distroApplications(id: string) {
    const distro = await this.distributionRepository.findOne(id);
    if (!distro) {
      throw new RpcException({
        message: 'Distributor not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    const apps = await this.appRepo.findAllDistroApps(distro.id);

    if (apps.length === 0) {
      return [];
    }

    return apps;
  }
  async distroPendingApplications(id: string) {
    const distro = await this.distributionRepository.findOne(id);
    if (!distro) {
      throw new RpcException({
        message: 'Distributor not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    const apps = await this.appRepo.findAllDistroApps(distro.id);

    if (apps.length === 0) {
      return [];
    }

    const pendingApplications = apps.filter(
      (app) => app.status === ApplicationStatus.PENDING,
    );

    return pendingApplications;
  }
  async distroApprovedApplications(id: string) {
    const distro = await this.distributionRepository.findOne(id);
    if (!distro) {
      throw new RpcException({
        message: 'Distributor not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    const apps = await this.appRepo.findAllDistroApps(distro.id);

    if (apps.length === 0) {
      return [];
    }

    const approvedApplications = apps.filter(
      (app) => app.status === ApplicationStatus.APPROVED,
    );

    return approvedApplications;
  }
  async distroRejectedApplications(id: string) {
    const distro = await this.distributionRepository.findOne(id);
    if (!distro) {
      throw new RpcException({
        message: 'Distributor not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    const apps = await this.appRepo.findAllDistroApps(distro.id);

    if (apps.length === 0) {
      return [];
    }

    const rejectedApplications = apps.filter(
      (app) => app.status === ApplicationStatus.REJECTED,
    );

    return rejectedApplications;
  }

  async findApprovedAllApplications() {
    const applications = await this.appRepo.findAll();

    if (applications.length === 0) {
      return [];
    }

    const pendingApplications = applications.filter(
      (app) => app.status === ApplicationStatus.APPROVED,
    );

    return pendingApplications;
  }

  async findRejectedAllApplications() {
    const applications = await this.appRepo.findAll();

    if (applications.length === 0) {
      return [];
    }

    const pendingApplications = applications.filter(
      (app) => app.status === ApplicationStatus.REJECTED,
    );

    return pendingApplications;
  }

  async approveArtistApplicationViaDistributor(applicationId: string) {
    const application = await this.appRepo.findAppId(applicationId);

    if (!application) {
      throw new RpcException({
        message: 'Application not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    if (application.status === ApplicationStatus.APPROVED) {
      throw new RpcException({
        message: 'Application already approved',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    await this.appRepo.updateStatus(applicationId, ApplicationStatus.APPROVED);

    const artist = await this.artistRepo.createArtist(
      application.stageName,
      application.bio,
      application.genre,
      application.distributorId,
    );

    return {
      message: 'Artist approved successfully',
      artist,
    };
  }
  async rejectArtistApplicationViaDistributor(applicationId: string) {
    const application = await this.appRepo.findAppId(applicationId);

    if (!application) {
      throw new RpcException({
        message: 'Application not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    if (application.status === ApplicationStatus.REJECTED) {
      throw new RpcException({
        message: 'Application already rejected',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    await this.appRepo.updateStatus(applicationId, ApplicationStatus.REJECTED);

    return {
      message: 'Artist application rejected',
      application,
    };
  }
}
