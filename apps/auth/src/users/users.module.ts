import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from 'prisma/prisma.service';
import { TokenRepository } from './repository/token.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, TokenRepository, PrismaService],
})
export class UsersModule {}
