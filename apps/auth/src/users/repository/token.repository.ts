import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Token } from '@prisma/client';

@Injectable()
export class TokenRepository {
  constructor(private prisma: PrismaService) {}

  async createToken(
    userId: string,
    email: string,
    code: number,
    expiresAt: Date,
  ): Promise<Token> {
    return this.prisma.token.create({
      data: { userId, email, code, expiresAt },
    });
  }

  async findByEmail(email: string): Promise<Token> {
    return this.prisma.token.findFirst({
      where: { email },
    });
  }

  async deleteExpiredTokens() {
    return this.prisma.token.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
