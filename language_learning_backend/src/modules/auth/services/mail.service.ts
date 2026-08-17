import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  private readonly mailFrom: string;

  constructor(configService: ConfigService) {
    const host = configService.getOrThrow<string>('SMTP_HOST');
    const port = Number(configService.getOrThrow<string>('SMTP_PORT'));
    const secure = configService.get<string>('SMTP_SECURE', 'true') === 'true';
    const user = configService.getOrThrow<string>('SMTP_USER');
    const password = configService.getOrThrow<string>('SMTP_PASSWORD');
    this.mailFrom = configService.getOrThrow<string>('MAIL_FROM');
    if (!Number.isInteger(port) || port <= 0) {
      throw new Error('SMTP_PORT không hợp lệ');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass: password },
    });
  }

  async sendPasswordResetOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.mailFrom,
      to: email,
      subject: 'Mã xác minh đặt lại mật khẩu',
      text: [
        `Mã OTP đặt lại mật khẩu của bạn là: ${otp}`,
        'Mã có hiệu lực trong 5 phút.',
        'Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.',
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Đặt lại mật khẩu</h2>
          <p>Mã OTP của bạn là:</p>
          <p style="font-size: 28px; font-weight: bold; letter-spacing: 8px">
            ${otp}
          </p>
          <p>Mã có hiệu lực trong 5 phút.</p>
          <p>
            Nếu bạn không yêu cầu đặt lại mật khẩu,
            hãy bỏ qua email này.
          </p>
        </div>
      `,
    });
  }

  async sendEmailVerificationOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.mailFrom,
      to: email,
      subject: 'Xác minh tài khoản Korean Learning',
      text: [
        `Mã OTP xác minh email của bạn là: ${otp}`,
        'Mã có hiệu lực trong 5 phút.',
        'Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.',
      ].join('\n'),
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Xác minh tài khoản</h2>

        <p>Mã OTP xác minh email của bạn là:</p>

        <p style="font-size: 28px; font-weight: bold; letter-spacing: 8px">
          ${otp}
        </p>
        <p>Mã có hiệu lực trong 5 phút.</p>
        <p>
          Nếu bạn không đăng ký tài khoản,
          hãy bỏ qua email này.
        </p>
      </div>
    `,
    });
  }
}
