import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators'; // ← ADD THIS LINE

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}


  async signup(email: string, password: string) {
    try {
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: 'auth_signup' }, { email, password })
          .pipe(timeout(10_000)), // 10 s guard
      );
      return result;              
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }

  async allUsers() {
    try {
      const result = await firstValueFrom(
        this.authClient
          .send({ cmd: 'all_users' }, {})
          .pipe(timeout(10_000)), // 10 s guard
      );
      return result;              
    } catch (err: any) {
      // Nest already turned RPC exceptions into proper HTTP errors
      throw err;
    }
  }


}

