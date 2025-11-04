import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcExceptionFilter } from './common/filters/rpc-exception.filter';

async function bootstrap() {
  const logger = new Logger('Starter-Play-V1');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new RpcExceptionFilter());

  const configService = app.get(ConfigService);

  const port = configService.get<string>('PORT');
  await app.listen(port, () => logger.log(`App running on Port: ${port}`));
}
bootstrap();
