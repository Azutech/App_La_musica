import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Starter-Play-V1');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<string>('PORT');

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.REDIS,
      options: {
        host:  configService.get<string>('REDIS_HOST'),
        port:  configService.get<number>('REDIS_PORT'),
        username:  configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
        channel: configService.get<string>('REDIS_CHANNEL'),
      },
    });

  await microservice.listen();

  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
