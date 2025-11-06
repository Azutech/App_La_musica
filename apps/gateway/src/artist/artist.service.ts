import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { JwtService } from 'src/guards/jwt/jwt.service';
import { ApplyArtistDto, DistributionDto } from './dto/artist.dto';
@Injectable()
export class ArtistService {
  constructor(
    @Inject('ARTIST_SERVICE') private readonly authClient: ClientProxy,
    // private readonly jwtService: JwtService,
  ) {}

  async applyArtist(applyArtistDto: ApplyArtistDto) {
    try {
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: 'artist_apply' }, applyArtistDto)
          .pipe(timeout(10_000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async addDistributor(distributionDto: DistributionDto) {
    try {
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: 'add_distributor' }, distributionDto)
          .pipe(timeout(10_000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
}
 
