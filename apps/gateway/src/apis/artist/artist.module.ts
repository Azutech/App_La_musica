import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { CustomJwtModule } from 'src/guards/jwt/jwt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisClientService } from 'src/shared/redis-client.service';

@Module({
  imports: [
       CustomJwtModule,
        ConfigModule,
        ClientsModule.registerAsync([
          {
            name: 'ARTIST_SERVICE',
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
  providers: [ArtistService, {
          provide: RedisClientService,
          inject: ['ARTIST_SERVICE'],
          useFactory: (artistClient) => new RedisClientService(artistClient),
        }],
})
export class ArtistModule {
  
}
