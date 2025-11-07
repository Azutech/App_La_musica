import { Injectable, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ApplyArtistDto } from 'src/artist-application/dtos/applications.dto';
import { ArtistApplicationRepository } from 'src/artist-application/repository/application.repository';
import { ApplicationStatus } from './enums/enum.util';
import { ArtistRepository } from 'src/artists/repository/artist.repository';

@Injectable()
export class ArtistApplicationService {
  constructor(
    private appRepo: ArtistApplicationRepository,
    // private authClient: ClientProxy,

  private artistRepo: ArtistRepository
  ) {}

  
  async applyViaUser(dto: ApplyArtistDto) {
    const applyArtist = await this.appRepo.findUserAppsId(dto.userId);
    if (applyArtist) {
      throw new RpcException({
        message: 'Applications already created',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const createApp = await this.appRepo.createUser({
      userId: dto.userId,
      stageName: dto.stageName,
      bio: dto.bio,
      genre: dto.genre,
    });

    return createApp;
  }
  async applyViaDistributor(dto: ApplyArtistDto) {
    const applyArtist = await this.appRepo.findDistroId(dto.distributionId);
    if (applyArtist) {
      throw new RpcException({
        message: 'Applications already created',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const createApp = await this.appRepo.createUser({
      userId: dto.userId,
      stageName: dto.stageName,
      bio: dto.bio,
      genre: dto.genre,
    });

    return createApp;
  }
  async getApplicationByUserId(userId: string) {
    const application = await this.appRepo.findUserAppsId(userId);
    if (!application) {
      throw new RpcException({
        message: 'Application not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return application;
  }

  async getApplicationByDistributorId(distributorId: string) {
    const application = await this.appRepo.findDistroId(distributorId);
    if (!application) {
      throw new RpcException({
        message: 'Application not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return application;
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

      const artist = await this.artistRepo.createArtist({
      distributorId: application.distributorId,
      stageName: application.stageName,
      bio: application.bio,
      genre: application.genre,
    });

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

  async approveArtistApplicationViaUser(applicationId: string) {
    // Fetch the application
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

    // 1️⃣ Update the application status
    await this.appRepo.updateStatus(applicationId, ApplicationStatus.APPROVED);

    // 2️⃣ Create artist profile in this service
    const artist = await this.artistRepo.createArtist({
      userId: application.userId,
      stageName: application.stageName,
      bio: application.bio,
      genre: application.genre,
    });

    // 3️⃣ Update user service to mark them as artist
    // try {
    //   await lastValueFrom(
    //     this.authClient.send(
    //       { cmd: 'user_promote_to_artist' },
    //       { userId: application.userId, artistId: artist.id, role: 'artist' },
    //     ),
    //   );
    // } catch (err) {
    //   console.error('⚠️ Failed to notify user service:', err.message);
    // }

    return {
      message: 'Artist approved successfully',
      artist,
    };
  }
}
