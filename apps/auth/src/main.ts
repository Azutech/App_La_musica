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
          host: 'redis-11230.c85.us-east-1-2.ec2.redns.redis-cloud.com',
            port: 11230,
            username: "default",
            password: configService.get<string>('REDIS_PASSWORD'),
            // tls: {},

      },
    });

  await microservice.listen();

  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
