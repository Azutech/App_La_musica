import { Inject, Injectable } from '@nestjs/common';
import { ApplyArtistDto } from '../distributors/dto/artist.dto';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { timeout } from 'rxjs/internal/operators/timeout';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';

@Injectable()
export class ArtistService {
    @Inject('ARTIST_SERVICE') private readonly artistClient: ClientProxy


      async applyArtist(applyArtistDto: ApplyArtistDto) {
        try {
          const result = await firstValueFrom(
            this.artistClient
              .send({ cmd: 'artist_apply' }, applyArtistDto)
              .pipe(timeout(20000)), // 10 s guard
          );
          return result;
        } catch (err: any) {
          // Nest already turned RPC exceptions into proper HTTP errors
          throw err;
        }
      }
}
