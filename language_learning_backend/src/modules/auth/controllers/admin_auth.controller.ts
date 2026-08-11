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
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import { ApiOkEnvelope } from '../../../common/decorators/api_response.decorator';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { AuthService } from '../auth.service';
import type { AuthenticatedUser } from '../interfaces/jwt_payload.interface';
import { AdminAuthService } from '../services/admin_auth.service';
import { AdminLoginDto } from '../dto/admin/admin_login.dto';
import {
  AdminLoginResponseDto,
  CurrentAdminResponseDto,
} from '../dto/auth_response.dto';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  adminAuthService: any;
  constructor(private readonly authService: AdminAuthService) {}

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

  @Get('me')
  @UseGuards(JwtAuthGuard)
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
