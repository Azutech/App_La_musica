import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { CustomJwtModule } from 'src/guards/jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RedisClientService } from 'src/shared/redis-client.service';

@Module({
  imports: [
    CustomJwtModule,
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'FILE_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            username: configService.get<string>('REDIS_USERNAME'),
            password: configService.get<string>('REDIS_PASSWORD'),
          },
        }),
      },
    ]),
  ],
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    {
      provide: RedisClientService,
      inject: ['FILE_SERVICE'],
      useFactory: (fileClient) => new RedisClientService(fileClient),
    },
  ],
})
export class FileUploadModule {}
