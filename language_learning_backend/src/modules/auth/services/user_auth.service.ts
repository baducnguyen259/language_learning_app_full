import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../../database/prisma.service';
import { UserRole, UserStatus } from '../../../generated/prisma/enums';
import { RegisterDto } from '../dto/user/register.dto';
import { UserLoginDto } from '../dto/user/user_login.dto';
import { ChangePasswordDto } from '../dto/user/change_password.dto';
import { TokenService } from './token.service';
import { RefreshTokenDto } from '../dto/common/refresh_token.dto';
import { EmailVerificationService } from './email_verification.service';

@Injectable()
export class UserAuthService {
  private static readonly PASSWORD_SALT_ROUNDS = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async register(dto: RegisterDto) {
    const name = dto.name.trim();
    const email = dto.email.trim().toLowerCase();
    const response = {
      message:
        'Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản',
    };
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }
    this.ensurePasswordDoesNotMatchAccount(dto.password, name, email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
      },
    });

    if (existingUser) {
      if (
        existingUser.role === UserRole.USER &&
        existingUser.status === UserStatus.ACTIVE &&
        !existingUser.emailVerifiedAt
      ) {
        await this.emailVerificationService.resend({ email });
        return response;
      }
      throw new ConflictException('Email này đã được đăng ký');
    }
    const passwordHash = await bcrypt.hash(
      dto.password,
      UserAuthService.PASSWORD_SALT_ROUNDS,
    );
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: null,
        termsAcceptedAt: new Date(),
      },
      select: { id: true, email: true },
    });

    await this.emailVerificationService.sendRegistrationOtp(user);
    return response;
  }

  async login(dto: UserLoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
    if (user.status === UserStatus.LOCKED) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }
    if (user.role !== UserRole.USER) {
      throw new UnauthorizedException(
        'Tài khoản này không dành cho ứng dụng học',
      );
    }
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Email chưa được xác minh');
    }
    const tokens = await this.tokenService.issueTokenPair(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Mật khẩu mới xác nhận không khớp');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }
    if (!user.passwordHash) {
      throw new BadRequestException(
        'Tài khoản Google không có mật khẩu để thay đổi',
      );
    }
    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
    }
    const isSameAsCurrentPassword = await bcrypt.compare(
      dto.newPassword,
      user.passwordHash,
    );
    if (isSameAsCurrentPassword) {
      throw new BadRequestException(
        'Mật khẩu mới không được trùng với mật khẩu hiện tại',
      );
    }
    this.ensurePasswordDoesNotMatchAccount(
      dto.newPassword,
      user.name,
      user.email,
    );
    const newPasswordHash = await bcrypt.hash(
      dto.newPassword,
      UserAuthService.PASSWORD_SALT_ROUNDS,
    );
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash, tokenVersion: { increment: 1 } },
      }),

      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return {
      message: 'Đổi mật khẩu thành công',
    };
  }

  async logoutAll(userId: string) {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { tokenVersion: { increment: 1 } },
      }),

      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return {
      message: 'Đã đăng xuất khỏi tất cả thiết bị',
    };
  }

  refresh(dto: RefreshTokenDto) {
    return this.tokenService.rotate(dto.refreshToken, UserRole.USER);
  }
  logout(dto: RefreshTokenDto) {
    return this.tokenService.revoke(dto.refreshToken);
  }

  private ensurePasswordDoesNotMatchAccount(
    password: string,
    name: string,
    email: string,
  ): void {
    const normalizedPassword = password.trim().toLowerCase();
    const normalizedName = name.trim().toLowerCase().replace(/\s+/g, '');
    const emailUsername = email.split('@')[0]?.toLowerCase() ?? '';
    if (
      normalizedPassword === normalizedName ||
      normalizedPassword === emailUsername
    ) {
      throw new BadRequestException(
        'Mật khẩu không được trùng với họ tên hoặc tên email',
      );
    }
  }
}
