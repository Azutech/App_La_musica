import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject('FILE_SERVICE') private readonly distroClient: ClientProxy,
  ) {}

async uploadFile(file: any) {
  try {
    const result = await firstValueFrom(
      this.distroClient
        .send({ cmd: 'uploadFile' }, { file }) // Wrap in object
        .pipe(timeout(20000)),
    );

    return result;
  } catch (err: any) {
    throw err;
  }
}
}
