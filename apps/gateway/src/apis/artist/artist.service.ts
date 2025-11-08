import { Inject, Injectable } from '@nestjs/common';
import { ApplyArtistDto } from '../distributors/dto/artist.dto';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { timeout } from 'rxjs/internal/operators/timeout';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';

@Injectable()
export class ArtistService {
  @Inject('ARTIST_SERVICE') private readonly artistClient: ClientProxy;

  async applyArtist(applyArtistDto: ApplyArtistDto) {
    try {
      const result = await firstValueFrom(
        this.artistClient
          .send({ cmd: 'artist_apply_user' }, applyArtistDto)
          .pipe(timeout(20000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
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
}
