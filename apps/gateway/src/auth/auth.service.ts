import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  async signup(email: string, password: string) {
    return firstValueFrom(
this.authClient.send({ cmd: 'signup' }, { email, password })    );
  }

//   async login(email: string, password: string) {
//     return firstValueFrom(
//       this.authClient.send('auth_login', { email, password })
//     );
//   }
}

