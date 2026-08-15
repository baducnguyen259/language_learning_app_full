import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from '../../../database/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  AuthenticatedUser,
  JwtPayload,
} from '../interfaces/jwt_payload.interface';
import { UserStatus } from '../../../generated/prisma/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        tokenVersion: true,
      },
    });
    if (!user || user.status === UserStatus.LOCKED) {
      throw new UnauthorizedException(
        'Tài khoản không tồn tại hoặc đã bị khóa ',
      );
    }
    if (payload.tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException(
        'Phiên đăng nhập đã hết hiệu lực. Vui lòng đăng nhập lại',
      );
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
