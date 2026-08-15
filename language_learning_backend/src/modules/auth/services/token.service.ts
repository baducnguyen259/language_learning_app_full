import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';

import { PrismaService } from '../../../database/prisma.service';
import { UserRole, UserStatus } from '../../../generated/prisma/enums';

type TokenUser = {
  id: string;
  email: string;
  role: UserRole;
  tokenVersion: number;
};

type CreatedTokenPair = {
  accessToken: string;
  refreshToken: string;
  refreshTokenHash: string;
  refreshTokenExpiresAt: Date;
};

@Injectable()
export class TokenService {
  private readonly refreshTokenLifetimeMs: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    const refreshTokenDays = Number(
      configService.get<string>('REFRESH_TOKEN_EXPIRES_IN_DAYS', '30'),
    );
    if (!Number.isInteger(refreshTokenDays) || refreshTokenDays <= 0) {
      throw new Error('REFRESH_TOKEN_EXPIRES_IN_DAYS phải là số nguyên dương');
    }
    this.refreshTokenLifetimeMs = refreshTokenDays * 24 * 60 * 60 * 1000;
  }

  async issueTokenPair(user: TokenUser) {
    const tokenPair = await this.createTokenPair(user);
    await this.prisma.refreshToken.create({
      data: {
        tokenHash: tokenPair.refreshTokenHash,
        userId: user.id,
        expiresAt: tokenPair.refreshTokenExpiresAt,
      },
    });
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  async rotate(refreshToken: string, requiredRole: UserRole) {
    const tokenHash = this.hashToken(refreshToken);
    const now = new Date();
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            tokenVersion: true,
          },
        },
      },
    });

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt <= now ||
      storedToken.user.status === UserStatus.LOCKED ||
      storedToken.user.role !== requiredRole
    ) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
    const nextTokenPair = await this.createTokenPair(storedToken.user);

    await this.prisma.$transaction(async (transaction) => {
      const revokedToken = await transaction.refreshToken.updateMany({
        where: { id: storedToken.id, revokedAt: null, expiresAt: { gt: now } },
        data: { revokedAt: now },
      });

      if (revokedToken.count !== 1) {
        throw new UnauthorizedException('Refresh token đã được sử dụng');
      }
      await transaction.refreshToken.create({
        data: {
          tokenHash: nextTokenPair.refreshTokenHash,
          userId: storedToken.user.id,
          expiresAt: nextTokenPair.refreshTokenExpiresAt,
        },
      });
    });
    return {
      accessToken: nextTokenPair.accessToken,
      refreshToken: nextTokenPair.refreshToken,
    };
  }
  async revoke(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return {
      message: 'Đăng xuất thành công',
    };
  }

  async revokeAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async createTokenPair(user: TokenUser): Promise<CreatedTokenPair> {
    const refreshToken = randomBytes(64).toString('base64url');
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });
    return {
      accessToken,
      refreshToken,
      refreshTokenHash: this.hashToken(refreshToken),
      refreshTokenExpiresAt: new Date(Date.now() + this.refreshTokenLifetimeMs),
    };
  }
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
