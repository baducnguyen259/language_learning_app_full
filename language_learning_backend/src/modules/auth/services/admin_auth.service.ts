import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../../database/prisma.service';
import { UserRole, UserStatus } from '../../../generated/prisma/enums';
import { AdminLoginDto } from '../dto/admin/admin_login.dto';
import { TokenService } from './token.service';
import { RefreshTokenDto } from '../dto/common/refresh_token.dto';
import { ApiErrorCode } from '../../../common/enums/api_error_code.enum';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(dto: AdminLoginDto) {
    const email = dto.email.trim().toLowerCase();
    const admin = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!admin || !admin.passwordHash) {
      throw new UnauthorizedException({
        code: ApiErrorCode.INVALID_CREDENTIALS,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: ApiErrorCode.INVALID_CREDENTIALS,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }
    if (admin.status === UserStatus.LOCKED) {
      throw new UnauthorizedException({
        code: ApiErrorCode.ACCOUNT_LOCKED,
        message: 'Tài khoản đã bị khóa',
      });
    }
    if (admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException({
        code: ApiErrorCode.ADMIN_ACCESS_REQUIRED,
        message: 'Tài khoản không có quyền quản trị',
      });
    }
    const tokens = await this.tokenService.issueTokenPair(admin);
    return {
      ...tokens,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }
  refresh(dto: RefreshTokenDto) {
    return this.tokenService.rotate(dto.refreshToken, UserRole.ADMIN);
  }
  logout(dto: RefreshTokenDto) {
    return this.tokenService.revoke(dto.refreshToken);
  }
}
