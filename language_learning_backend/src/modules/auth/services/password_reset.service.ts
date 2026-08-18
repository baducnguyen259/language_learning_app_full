import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes, randomInt } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../database/prisma.service';
import { UserRole, UserStatus } from '../../../generated/prisma/enums';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyPasswordResetOtpDto,
} from '../dto/user/password_reset.dto';
import { MailService } from './mail.service';
import { ApiErrorCode } from '../../../common/enums/api_error_code.enum';

@Injectable()
export class PasswordResetService {
  private static readonly OTP_EXPIRES_MS = 5 * 60 * 1000;
  private static readonly OTP_RESEND_COOLDOWN_MS = 60 * 1000;
  private static readonly OTP_MAX_ATTEMPTS = 5;
  private static readonly RESET_TOKEN_EXPIRES_MS = 10 * 60 * 1000;
  private static readonly PASSWORD_SALT_ROUNDS = 12;
  private static readonly GENERIC_MESSAGE =
    'Nếu email tồn tại, mã OTP đã được gửi';
  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async requestOtp(dto: ForgotPasswordDto) {
    const email = dto.email.trim().toLowerCase();
    const genericResponse = {
      message: PasswordResetService.GENERIC_MESSAGE,
    };

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
      },
    });
    if (
      !user ||
      user.role !== UserRole.USER ||
      user.status !== UserStatus.ACTIVE ||
      !user.emailVerifiedAt
    ) {
      return genericResponse;
    }

    const existingRequest = await this.prisma.passwordResetRequest.findUnique({
      where: { userId: user.id },
      select: { lastSentAt: true },
    });

    if (
      existingRequest &&
      Date.now() - existingRequest.lastSentAt.getTime() <
        PasswordResetService.OTP_RESEND_COOLDOWN_MS
    ) {
      return genericResponse;
    }

    const otp = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const otpHash = await bcrypt.hash(otp, 10);
    const now = new Date();

    await this.prisma.passwordResetRequest.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        otpHash,
        otpExpiresAt: new Date(
          now.getTime() + PasswordResetService.OTP_EXPIRES_MS,
        ),
        attempts: 0,
        lastSentAt: now,
      },
      update: {
        otpHash,
        otpExpiresAt: new Date(
          now.getTime() + PasswordResetService.OTP_EXPIRES_MS,
        ),
        attempts: 0,
        lastSentAt: now,
        verifiedAt: null,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });

    try {
      await this.mailService.sendPasswordResetOtp(user.email, otp);
    } catch (error: unknown) {
      this.logger.error(
        'Không thể gửi email OTP đặt lại mật khẩu',
        error instanceof Error ? error.stack : undefined,
      );
      await this.prisma.passwordResetRequest.deleteMany({
        where: { userId: user.id, otpHash },
      });
    }

    return genericResponse;
  }

  async verifyOtp(dto: VerifyPasswordResetOtpDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (
      !user ||
      user.role !== UserRole.USER ||
      user.status !== UserStatus.ACTIVE
    ) {
      throw this.invalidOtpException();
    }
    const resetRequest = await this.prisma.passwordResetRequest.findUnique({
      where: { userId: user.id },
    });
    if (
      !resetRequest ||
      resetRequest.verifiedAt ||
      resetRequest.otpExpiresAt.getTime() <= Date.now() ||
      resetRequest.attempts >= PasswordResetService.OTP_MAX_ATTEMPTS
    ) {
      throw this.invalidOtpException();
    }

    const isOtpValid = await bcrypt.compare(dto.otp, resetRequest.otpHash);

    if (!isOtpValid) {
      await this.prisma.passwordResetRequest.update({
        where: { id: resetRequest.id },
        data: { attempts: { increment: 1 } },
      });
      throw this.invalidOtpException();
    }
    const resetToken = randomBytes(48).toString('base64url');
    const now = new Date();
    await this.prisma.passwordResetRequest.update({
      where: { id: resetRequest.id },
      data: {
        verifiedAt: now,
        resetTokenHash: this.hashToken(resetToken),
        resetTokenExpiresAt: new Date(
          now.getTime() + PasswordResetService.RESET_TOKEN_EXPIRES_MS,
        ),
      },
    });
    return { resetToken };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException({
        code: ApiErrorCode.PASSWORD_CONFIRMATION_MISMATCH,
        message: 'Mật khẩu xác nhận không khớp',
      });
    }
    const resetTokenHash = this.hashToken(dto.resetToken);
    const resetRequest = await this.prisma.passwordResetRequest.findUnique({
      where: { resetTokenHash },
      select: {
        id: true,
        verifiedAt: true,
        resetTokenExpiresAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (
      !resetRequest ||
      !resetRequest.verifiedAt ||
      !resetRequest.resetTokenExpiresAt ||
      resetRequest.resetTokenExpiresAt.getTime() <= Date.now() ||
      resetRequest.user.role !== UserRole.USER ||
      resetRequest.user.status !== UserStatus.ACTIVE
    ) {
      throw new UnauthorizedException({
        code: ApiErrorCode.INVALID_OR_EXPIRED_RESET_TOKEN,
        message: 'Reset token không hợp lệ hoặc đã hết hạn',
      });
    }
    this.ensurePasswordDoesNotMatchAccount(
      dto.newPassword,
      resetRequest.user.name,
      resetRequest.user.email,
    );
    if (resetRequest.user.passwordHash) {
      const isSamePassword = await bcrypt.compare(
        dto.newPassword,
        resetRequest.user.passwordHash,
      );
      if (isSamePassword) {
        throw new BadRequestException({
          code: ApiErrorCode.PASSWORD_REUSED,
          message: 'Mật khẩu mới không được trùng mật khẩu hiện tại',
        });
      }
    }
    const passwordHash = await bcrypt.hash(
      dto.newPassword,
      PasswordResetService.PASSWORD_SALT_ROUNDS,
    );

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetRequest.user.id },
        data: {
          passwordHash,
          tokenVersion: { increment: 1 },
        },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: resetRequest.user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      this.prisma.passwordResetRequest.delete({
        where: { id: resetRequest.id },
      }),
    ]);

    return { message: 'Đặt lại mật khẩu thành công' };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private invalidOtpException(): UnauthorizedException {
    return new UnauthorizedException({
      code: ApiErrorCode.INVALID_OR_EXPIRED_OTP,
      message: 'OTP không hợp lệ hoặc đã hết hạn',
    });
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
      throw new BadRequestException({
        code: ApiErrorCode.PASSWORD_MATCHES_ACCOUNT,
        message: 'Mật khẩu không được trùng với họ tên hoặc tên email',
      });
    }
  }
}
