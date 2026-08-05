import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../../generated/prisma/enums';
import { Roles } from '../../common/decorators/roles.decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async adminLogin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
    if (user.status === 'LOCKED') {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Tài khoản không có quyền quản trị');
    }
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      accessToken,
      user: {
        id: user?.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
