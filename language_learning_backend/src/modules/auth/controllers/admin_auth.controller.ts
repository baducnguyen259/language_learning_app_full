import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiOkEnvelope } from '../../../common/decorators/api_response.decorator';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import {
  AdminLoginResponseDto,
  CurrentAdminResponseDto,
} from '../dto/admin/admin_auth_response.dto';
import { AdminLoginDto } from '../dto/admin/admin_login.dto';
import type { AuthenticatedUser } from '../interfaces/jwt_payload.interface';
import { AdminAuthService } from '../services/admin_auth.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../generated/prisma/enums';
import {
  LogoutResponseDto,
  RefreshTokenDto,
  TokenPairResponseDto,
} from '../dto/common/refresh_token.dto';
import { minutes, Throttle } from '@nestjs/throttler';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Throttle({
    default: {
      limit: 5,
      ttl: minutes(5),
    },
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập quản trị viên',
  })
  @ApiOkEnvelope(AdminLoginResponseDto)
  @ApiUnauthorizedResponse({
    description: 'Email hoặc mật khẩu không đúng',
    type: ApiErrorResponseDto,
  })
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto);
  }

  @Throttle({
    default: {
      limit: 30,
      ttl: minutes(1),
    },
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy access token admin mới',
  })
  @ApiOkEnvelope(TokenPairResponseDto)
  @ApiUnauthorizedResponse({
    description: 'Refresh token không hợp lệ hoặc đã hết hạn',
    type: ApiErrorResponseDto,
  })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.adminAuthService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng xuất phiên admin hiện tại',
  })
  @ApiOkEnvelope(LogoutResponseDto)
  logout(@Body() dto: RefreshTokenDto) {
    return this.adminAuthService.logout(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Lấy thông tin admin đang đăng nhập',
  })
  @ApiOkEnvelope(CurrentAdminResponseDto)
  @ApiUnauthorizedResponse({
    description: 'Thiếu access token hoặc token không hợp lệ',
    type: ApiErrorResponseDto,
  })
  getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
