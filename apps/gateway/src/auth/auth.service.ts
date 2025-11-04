import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { JwtService } from 'src/guards/jwt/jwt.service';
import { CodeDto, CreateUserDto, LoginDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    try {
      console.log('Gateway: Sending signup', createUserDto);
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: 'auth_signup' }, { createUserDto })
          .pipe(timeout(10_000)), // 10 s guard
      );

      console.log('Gateway: Received', result);
      // 2. Extract user from microservice response
      const user = result.user; // { id, email }

      // 3. Generate JWT
      const authTokenParam = {
        userId: user.id,
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

  async allUsers() {
    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: 'all_users' }, {}).pipe(timeout(10_000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async login(loginDto: LoginDto) {
    try {
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: 'login_users' }, { loginDto })
          .pipe(timeout(10_000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async user_dashboard(userId: string) {
    try {
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: 'user_dashboard' }, { userId })
          .pipe(timeout(10_000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
  async verification(codeDto: CodeDto) {
    try {
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: 'user_verification' }, { codeDto })
          .pipe(timeout(10_000)), // 10 s guard
      );
      return result;
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }
}
