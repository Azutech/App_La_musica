import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { JwtService } from 'src/guards/jwt/jwt.service';
import {
  ApplyArtistDto,
  CodeDto,
  DistributionDto,
  LoginDto,
} from './dto/artist.dto';
@Injectable()
export class DistributorService {
  constructor(
    @Inject('DISTRIBUTOR_SERVICE') private readonly distroClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async addDistributor(distributionDto: DistributionDto) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'add_distributor' }, distributionDto)
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async loginDistributor(loginDto: LoginDto) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'login_distributor' }, loginDto)
          .pipe(timeout(20000)), // 10 s guard
      );

      const authTokenParam = {
        userId: result,
      };

      const token = this.jwtService.createEncryptedToken(authTokenParam); // ← Standard JWT

      return {
        auth: token,
        message: 'sign up successful',
      };
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async verifyDistributor(loginDto: CodeDto) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'verify_distributor' }, loginDto)
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async resendVerification(email: string) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'resend_verification' }, email)
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }

  async dashboard(distributorId: string) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'distributor_dashboard' }, { distributorId })
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async getAllDistributors() {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'distributor_list' }, {})
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
}
