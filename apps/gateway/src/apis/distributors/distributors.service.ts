import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { JwtService } from 'src/guards/jwt/jwt.service';
import {
  // ApplyArtistDto,
  CodeDto,
  DistributionDto,
  DistributionProfileDto,
  DistributionUboDto,
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
        message: 'sign in successful',
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
  async addProfile(distributionProfileDto: DistributionProfileDto) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'createdistroProfile' }, distributionProfileDto)
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async updateProfile(distributionProfileDto: DistributionProfileDto) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'updatedistroProfile' }, distributionProfileDto)
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }

  async viewProfile(distributorId: string) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'viewProfile' }, distributorId)
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }

  async createdistroUbo(distributionUboDto: DistributionUboDto) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'createdistroUbo' }, distributionUboDto)
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }

  async viewdistroUbo(distributorId: string) {
    try {
      const result = await firstValueFrom(
        this.distroClient
          .send({ cmd: 'viewdistroUbo' }, distributorId)
          .pipe(timeout(20000)), // 10 s guard
      );

      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
}
