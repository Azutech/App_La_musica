import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Token } from '@prisma/client';

@Injectable()
export class TokenRepository {
  constructor(private prisma: PrismaService) {}

  async createToken(
    distributorId: string,
    email: string,
    code: number,
    expiresAt: Date,
  ): Promise<Token> {
    return this.prisma.token.create({
      data: { distributorId, email, code, expiresAt },
    });
  }

  async findByEmail(email: string): Promise<Token> {
    return await this.prisma.token.findFirst({
      where: { email },
    });
  }

  async findTokenByCode(code: number): Promise<Token | null> {
    return await this.prisma.token.findFirst({
      where: { code },
    });
  }

  async deleteTokenCode(code: number): Promise<void> {
    await this.prisma.token.deleteMany({
      where: { code },
    });
  }
  async deleteTokenI(email: string): Promise<void> {
    await this.prisma.token.deleteMany({
      where: { email },
    });
  }
  async deleteExpiredTokens() {
    return await this.prisma.token.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}