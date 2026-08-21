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
import { ApiErrorCode } from '../../../common/enums/api_error_code.enum';

@Injectable()
export class UserAuthService {
  private static readonly PASSWORD_SALT_ROUNDS = 12;
  private static readonly UNVERIFIED_ACCOUNT_TTL_MS = 24 * 60 * 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const response = {
      message:
        'Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản',
    };
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException({
        code: ApiErrorCode.PASSWORD_CONFIRMATION_MISMATCH,
        message: 'Mật khẩu xác nhận không khớp',
      });
    }
    this.ensurePasswordDoesNotMatchAccount(dto.password, email);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });
    let expiredUserId: string | null = null;
    if (existingUser) {
      const isUnverifiedUser =
        existingUser.role === UserRole.USER &&
        existingUser.status === UserStatus.ACTIVE &&
        !existingUser.emailVerifiedAt;
      if (!isUnverifiedUser) {
        throw new ConflictException({
          code: ApiErrorCode.EMAIL_ALREADY_REGISTERED,
          message: 'Email này đã được đăng ký',
        });
      }
      const expirationTime =
        existingUser.createdAt.getTime() +
        UserAuthService.UNVERIFIED_ACCOUNT_TTL_MS;
      if (Date.now() < expirationTime) {
        await this.emailVerificationService.resend({ email });
        return response;
      }
      expiredUserId = existingUser.id;
    }
    const passwordHash = await bcrypt.hash(
      dto.password,
      UserAuthService.PASSWORD_SALT_ROUNDS,
    );
    const expirationCutoff = new Date(
      Date.now() - UserAuthService.UNVERIFIED_ACCOUNT_TTL_MS,
    );
    const user = await this.prisma.$transaction(async (transaction) => {
      if (expiredUserId) {
        const deletedUser = await transaction.user.deleteMany({
          where: {
            id: expiredUserId,
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
            emailVerifiedAt: null,
            createdAt: { lte: expirationCutoff },
          },
        });
        if (deletedUser.count !== 1) {
          throw new ConflictException({
            code: ApiErrorCode.REGISTRATION_STATE_CHANGED,
            message: 'Trạng thái đăng ký đã thay đổi. Vui lòng thử lại',
          });
        }
      }
      return transaction.user.create({
        data: {
          email,
          passwordHash,
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerifiedAt: null,
          termsAcceptedAt: new Date(),
        },
        select: { id: true, email: true },
      });
    });
    // Chỉ gửi email sau khi transaction đã hoàn tất.
    await this.emailVerificationService.sendRegistrationOtp(user);

    return response;
  }

  async login(dto: UserLoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException({
        code: ApiErrorCode.INVALID_CREDENTIALS,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: ApiErrorCode.INVALID_CREDENTIALS,
        message: 'Email hoặc mật khẩu không chính xác',
      });
    }
    if (user.status === UserStatus.LOCKED) {
      throw new UnauthorizedException({
        code: ApiErrorCode.ACCOUNT_LOCKED,
        message: 'Tài khoản đã bị khóa',
      });
    }
    if (user.role !== UserRole.USER) {
      throw new UnauthorizedException({
        code: ApiErrorCode.USER_APP_ACCESS_REQUIRED,
        message: 'Tài khoản này không dành cho ứng dụng học',
      });
    }
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException({
        code: ApiErrorCode.EMAIL_NOT_VERIFIED,
        message: 'Email chưa được xác minh',
      });
    }
    const tokens = await this.tokenService.issueTokenPair(user);
    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        requiresProfileSetup: !user.profileCompletedAt,
      },
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException({
        code: ApiErrorCode.PASSWORD_CONFIRMATION_MISMATCH,
        message: 'Mật khẩu mới xác nhận không khớp',
      });
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        passwordHash: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException({
        code: ApiErrorCode.INVALID_SESSION,
        message: 'Phiên đăng nhập không hợp lệ',
      });
    }
    if (!user.passwordHash) {
      throw new BadRequestException({
        code: ApiErrorCode.PASSWORD_NOT_AVAILABLE,
        message: 'Tài khoản Google không có mật khẩu để thay đổi',
      });
    }
    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException({
        code: ApiErrorCode.CURRENT_PASSWORD_INCORRECT,
        message: 'Mật khẩu hiện tại không chính xác',
      });
    }
    const isSameAsCurrentPassword = await bcrypt.compare(
      dto.newPassword,
      user.passwordHash,
    );
    if (isSameAsCurrentPassword) {
      throw new BadRequestException({
        code: ApiErrorCode.PASSWORD_REUSED,
        message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
      });
    }
    this.ensurePasswordDoesNotMatchAccount(
      dto.newPassword,
      user.email,
      user.name,
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
    email: string,
    name = '',
  ): void {
    const normalizedPassword = password.trim().toLowerCase();
    const normalizedName = name.trim().toLowerCase().replace(/\s+/g, '');
    const emailUsername = email.split('@')[0]?.toLowerCase() ?? '';
    if (
      (normalizedName.length > 0 && normalizedPassword === normalizedName) ||
      normalizedPassword === emailUsername
    ) {
      throw new BadRequestException({
        code: ApiErrorCode.PASSWORD_MATCHES_ACCOUNT,
        message: 'Mật khẩu không được trùng với họ tên hoặc tên email',
      });
    }
  }
}
