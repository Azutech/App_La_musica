import { Inject, Injectable } from '@nestjs/common';
import { ApplyArtistDto } from '../distributors/dto/artist.dto';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { timeout } from 'rxjs/internal/operators/timeout';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';

@Injectable()
export class ArtistService {
  @Inject('ARTIST_SERVICE') private readonly artistClient: ClientProxy;

  async applyArtistviaDistro(applyArtistDto: ApplyArtistDto) {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'artist_apply_distributor' }, applyArtistDto)
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async getApplicationByDistributorId(applicationId: string) {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'artist_get_application' }, applicationId)
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }

  async approveArtistApplication(applicationId: string) {
    try {
      console.log('Service got application ID:', applicationId);
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'approve_application' }, applicationId)
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }

  async rejectArtistApplication(applicationId: string) {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'artist_reject_application' }, applicationId)
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }

  async getAllPendingApplications() {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'pending_application' }, {})
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }

  async allDistroApplications(distributorId: string) {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'distro_application' }, distributorId)
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async pendingDistroApplications(distributorId: string) {
    try {
      console.log(distributorId);
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'distro_pending_application' }, distributorId)
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async approvedDistroApplications(distributorId: string) {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'distro_approved_application' }, distributorId)
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async rejectedDistroApplications(distributorId: string) {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'distro_rejected_application' }, distributorId)
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async getAllApprovedApplications() {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'approved_application' }, {})
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async getAllRejectedApplications() {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'rejected_application' }, {})
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
}
