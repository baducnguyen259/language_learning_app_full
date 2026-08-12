import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

import { PrismaService } from '../../../database/prisma.service';
import { UserRole, UserStatus } from '../../../generated/prisma/enums';
import { GoogleLoginDto } from '../dto/user/google_login.dto';

@Injectable()
export class GoogleAuthService {
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.googleClientId = configService.getOrThrow<string>('GOOGLE_CLIENT_ID');

    this.googleClient = new OAuth2Client();
  }

  async login(dto: GoogleLoginDto) {
    const payload = await this.verifyGoogleIdToken(dto.idToken);

    const googleId = payload.sub;
    const email = payload.email?.trim().toLowerCase();

    if (!googleId || !email || payload.email_verified !== true) {
      throw new UnauthorizedException('Tài khoản Google chưa xác minh email');
    }

    const existingByGoogleId = await this.prisma.user.findUnique({
      where: {
        googleId,
      },
    });

    if (existingByGoogleId) {
      this.ensureUserCanUseGoogleLogin(
        existingByGoogleId.role,
        existingByGoogleId.status,
      );

      const user = await this.prisma.user.update({
        where: {
          id: existingByGoogleId.id,
        },
        data: {
          name: payload.name?.trim() || existingByGoogleId.name,

          avatarUrl: payload.picture ?? existingByGoogleId.avatarUrl,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      });

      return this.createLoginResponse(user);
    }

    const existingByEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingByEmail) {
      this.ensureUserCanUseGoogleLogin(
        existingByEmail.role,
        existingByEmail.status,
      );

      if (existingByEmail.googleId && existingByEmail.googleId !== googleId) {
        throw new ConflictException(
          'Email đã được liên kết với một tài khoản Google khác',
        );
      }

      if (!this.isGoogleAuthoritativeForEmail(email, payload.hd)) {
        throw new ConflictException(
          'Email đã có tài khoản. Hãy đăng nhập bằng mật khẩu để liên kết Google',
        );
      }

      const linkedUser = await this.prisma.user.update({
        where: {
          id: existingByEmail.id,
        },
        data: {
          googleId,
          avatarUrl: payload.picture ?? existingByEmail.avatarUrl,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
        },
      });

      return this.createLoginResponse(linkedUser);
    }

    const name = payload.name?.trim() || email.split('@')[0] || 'Người học';

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: null,
        googleId,
        avatarUrl: payload.picture ?? null,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });

    return this.createLoginResponse(newUser);
  }

  private async verifyGoogleIdToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Google ID token không hợp lệ');
      }

      return payload;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Google ID token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  private ensureUserCanUseGoogleLogin(
    role: UserRole,
    status: UserStatus,
  ): void {
    if (status === UserStatus.LOCKED) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    if (role !== UserRole.USER) {
      throw new UnauthorizedException(
        'Tài khoản này không dành cho ứng dụng học',
      );
    }
  }

  private isGoogleAuthoritativeForEmail(
    email: string,
    hostedDomain?: string,
  ): boolean {
    return email.endsWith('@gmail.com') || Boolean(hostedDomain);
  }

  private async createLoginResponse(user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl: string | null;
  }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user,
    };
  }
}
