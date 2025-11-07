import { Module } from '@nestjs/common';
import { DistributorService } from './distributors.service';
import { ArtistController } from './distributors.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomJwtModule } from 'src/guards/jwt/jwt.module';
import { RedisClientService } from 'src/shared/redis-client.service';

@Module({
  imports: [
    CustomJwtModule,
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'DISTRIBUTOR_SERVICE',
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
  controllers: [ArtistController],
  providers: [DistributorService, {
        provide: RedisClientService,
        inject: ['DISTRIBUTOR_SERVICE'],
        useFactory: (distroClient) => new RedisClientService(distroClient),
      },],
})
export class DistributorModule {}
