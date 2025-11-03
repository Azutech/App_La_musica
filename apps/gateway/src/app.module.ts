import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core'; // ← THIS IS THE RIGHT ONE
import { AllRpcExceptionsFilter } from './common/filters/rpc-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
        ConfigModule.forRoot({
      isGlobal: true, // <-- this makes ConfigService available everywhere
      envFilePath: '.env', // optional, defaults to process.env
    }),
    AuthModule],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_FILTER,
      useClass: AllRpcExceptionsFilter,
    },],
})
export class AppModule {}
