import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../../database/prisma.service';
import { UserRole, UserStatus } from '../../../generated/prisma/enums';
import {
  ResendEmailVerificationDto,
  VerifyEmailOtpDto,
} from '../dto/user/email_verification.dto';
import { MailService } from './mail.service';
import { TokenService } from './token.service';

type RegistrationUser = {
  id: string;
  email: string;
};

@Injectable()
export class EmailVerificationService {
  private static readonly OTP_EXPIRES_MS = 5 * 60 * 1000;
  private static readonly RESEND_COOLDOWN_MS = 60 * 1000;
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly GENERIC_MESSAGE =
    'Nếu tài khoản cần xác minh, mã OTP đã được gửi';
  private readonly logger = new Logger(EmailVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  async sendRegistrationOtp(user: RegistrationUser): Promise<void> {
    await this.createAndSendOtp(user);
  }

  async resend(dto: ResendEmailVerificationDto) {
    const email = dto.email.trim().toLowerCase();
    const response = {
      message: EmailVerificationService.GENERIC_MESSAGE,
    };

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        emailVerificationOtp: { select: { lastSentAt: true } },
      },
    });

    if (
      !user ||
      user.role !== UserRole.USER ||
      user.status !== UserStatus.ACTIVE ||
      user.emailVerifiedAt
    ) {
      return response;
    }
    if (
      user.emailVerificationOtp &&
      Date.now() - user.emailVerificationOtp.lastSentAt.getTime() <
        EmailVerificationService.RESEND_COOLDOWN_MS
    ) {
      return response;
    }

    await this.createAndSendOtp({ id: user.id, email: user.email });
    return response;
  }

  async verify(dto: VerifyEmailOtpDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatarUrl: true,
        tokenVersion: true,
        emailVerifiedAt: true,
        emailVerificationOtp: true,
      },
    });
    if (
      !user ||
      user.role !== UserRole.USER ||
      user.status !== UserStatus.ACTIVE ||
      user.emailVerifiedAt ||
      !user.emailVerificationOtp ||
      user.emailVerificationOtp.expiresAt.getTime() <= Date.now() ||
      user.emailVerificationOtp.attempts >=
        EmailVerificationService.MAX_ATTEMPTS
    ) {
      throw this.invalidOtpException();
    }

    const isOtpValid = await bcrypt.compare(
      dto.otp,
      user.emailVerificationOtp.otpHash,
    );

    if (!isOtpValid) {
      await this.prisma.emailVerificationOtp.update({
        where: { id: user.emailVerificationOtp.id },
        data: { attempts: { increment: 1 } },
      });
      throw this.invalidOtpException();
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      }),

      this.prisma.emailVerificationOtp.delete({
        where: { id: user.emailVerificationOtp.id },
      }),
    ]);

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

  private async createAndSendOtp(user: RegistrationUser): Promise<void> {
    const otp = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const otpHash = await bcrypt.hash(otp, 10);
    const now = new Date();

    await this.prisma.emailVerificationOtp.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        otpHash,
        expiresAt: new Date(
          now.getTime() + EmailVerificationService.OTP_EXPIRES_MS,
        ),
        attempts: 0,
        lastSentAt: now,
      },
      update: {
        otpHash,
        expiresAt: new Date(
          now.getTime() + EmailVerificationService.OTP_EXPIRES_MS,
        ),
        attempts: 0,
        lastSentAt: now,
      },
    });
    try {
      await this.mailService.sendEmailVerificationOtp(user.email, otp);
    } catch (error: unknown) {
      this.logger.error(
        'Không thể gửi OTP xác minh email',
        error instanceof Error ? error.stack : undefined,
      );
      await this.prisma.emailVerificationOtp.deleteMany({
        where: { userId: user.id, otpHash },
      });
    }
  }

  private invalidOtpException(): UnauthorizedException {
    return new UnauthorizedException('OTP không hợp lệ hoặc đã hết hạn');
  }
}
