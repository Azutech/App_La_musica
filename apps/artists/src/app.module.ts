import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ArtistApplicationModule } from './apis/artist-application/artist-application.module';
import { ArtistsModule } from './apis/artists/artists.module';
import { DistributionModule } from './apis/distribution/distribution.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // <-- this makes ConfigService available everywhere
      envFilePath: '.env', // optional, defaults to process.env
    }),
    PrismaModule,
    ArtistApplicationModule,
    ArtistsModule,
    DistributionModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
