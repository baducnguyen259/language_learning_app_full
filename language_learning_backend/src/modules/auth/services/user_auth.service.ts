import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../../database/prisma.service';
import { UserRole, UserStatus } from '../../../generated/prisma/enums';
import { RegisterDto } from '../dto/user/register.dto';
import { UserLoginDto } from '../dto/user/user_login.dto';

@Injectable()
export class UserAuthService {
  private static readonly PASSWORD_SALT_ROUNDS = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const name = dto.name.trim();
    const email = dto.email.trim().toLowerCase();

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    this.ensurePasswordDoesNotMatchAccount(dto.password, name, email);

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
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
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });

    const accessToken = await this.createAccessToken(user);

    return {
      accessToken,
      user,
    };
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

    const accessToken = await this.createAccessToken(user);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  private async createAccessToken(user: {
    id: string;
    email: string;
    role: UserRole;
  }): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
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
      throw new BadRequestException(
        'Mật khẩu không được trùng với họ tên hoặc tên email',
      );
    }
  }
}
