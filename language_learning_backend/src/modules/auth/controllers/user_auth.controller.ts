import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ApiCreatedEnvelope,
  ApiOkEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { RegisterDto } from '../dto/user/register.dto';
import {
  CurrentUserResponseDto,
  UserAuthResponseDto,
} from '../dto/user/user_auth_response.dto';
import { UserLoginDto } from '../dto/user/user_login.dto';
import type { AuthenticatedUser } from '../interfaces/jwt_payload.interface';
import { UserAuthService } from '../services/user_auth.service';
import { GoogleAuthService } from '../services/google_auth.service';
import { GoogleLoginDto } from '../dto/user/google_login.dto';
import {
  ChangePasswordDto,
  ChangePasswordResponseDto,
} from '../dto/user/change_password.dto';
import {
  LogoutResponseDto,
  RefreshTokenDto,
  TokenPairResponseDto,
} from '../dto/common/refresh_token.dto';
import { PasswordResetService } from '../services/password_reset.service';
import {
  ForgotPasswordDto,
  PasswordResetMessageResponseDto,
  ResetPasswordDto,
  VerifyPasswordResetOtpDto,
  VerifyPasswordResetOtpResponseDto,
} from '../dto/user/password_reset.dto';
import { EmailVerificationService } from '../services/email_verification.service';
import {
  EmailVerificationMessageResponseDto,
  ResendEmailVerificationDto,
  VerifyEmailOtpDto,
} from '../dto/user/email_verification.dto';

@ApiTags('User Auth')
@Controller('auth')
export class UserAuthController {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly passwordResetService: PasswordResetService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}
  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản người học',
  })
  @ApiCreatedEnvelope(EmailVerificationMessageResponseDto)
  @ApiConflictResponse({
    description: 'Email đã được đăng ký',
    type: ApiErrorResponseDto,
  })
  register(@Body() dto: RegisterDto) {
    return this.userAuthService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xác minh email đăng ký bằng OTP',
  })
  @ApiOkEnvelope(UserAuthResponseDto)
  @ApiUnauthorizedResponse({
    description: 'OTP không hợp lệ hoặc đã hết hạn',
    type: ApiErrorResponseDto,
  })
  verifyEmail(@Body() dto: VerifyEmailOtpDto) {
    return this.emailVerificationService.verify(dto);
  }

  @Post('resend-verification-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gửi lại OTP xác minh email',
  })
  @ApiOkEnvelope(EmailVerificationMessageResponseDto)
  resendVerificationOtp(@Body() dto: ResendEmailVerificationDto) {
    return this.emailVerificationService.resend(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập tài khoản người học',
  })
  @ApiOkEnvelope(UserAuthResponseDto)
  @ApiUnauthorizedResponse({
    description: 'Email hoặc mật khẩu không đúng hoặc tài khoản đã bị khóa',
    type: ApiErrorResponseDto,
  })
  login(@Body() dto: UserLoginDto) {
    return this.userAuthService.login(dto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập hoặc đăng ký bằng Google',
  })
  @ApiOkEnvelope(UserAuthResponseDto)
  @ApiUnauthorizedResponse({
    description: 'Google ID token không hợp lệ, hết hạn hoặc tài khoản bị khóa',
    type: ApiErrorResponseDto,
  })
  @ApiConflictResponse({
    description:
      'Email đã liên kết với tài khoản Google khác hoặc cần xác minh liên kết',
    type: ApiErrorResponseDto,
  })
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.googleAuthService.login(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gửi OTP đặt lại mật khẩu',
  })
  @ApiOkEnvelope(PasswordResetMessageResponseDto)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.passwordResetService.requestOtp(dto);
  }

  @Post('verify-reset-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xác minh OTP đặt lại mật khẩu',
  })
  @ApiOkEnvelope(VerifyPasswordResetOtpResponseDto)
  @ApiUnauthorizedResponse({
    description: 'OTP không hợp lệ hoặc đã hết hạn',
    type: ApiErrorResponseDto,
  })
  verifyResetOtp(@Body() dto: VerifyPasswordResetOtpDto) {
    return this.passwordResetService.verifyOtp(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đặt mật khẩu mới bằng reset token',
  })
  @ApiOkEnvelope(PasswordResetMessageResponseDto)
  @ApiBadRequestResponse({
    description: 'Mật khẩu xác nhận không khớp hoặc mật khẩu không hợp lệ',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Reset token không hợp lệ hoặc đã hết hạn',
    type: ApiErrorResponseDto,
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy access token mới bằng refresh token',
  })
  @ApiOkEnvelope(TokenPairResponseDto)
  @ApiUnauthorizedResponse({
    description: 'Refresh token không hợp lệ hoặc đã hết hạn',
    type: ApiErrorResponseDto,
  })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.userAuthService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng xuất phiên hiện tại',
  })
  @ApiOkEnvelope(LogoutResponseDto)
  logout(@Body() dto: RefreshTokenDto) {
    return this.userAuthService.logout(dto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Đổi mật khẩu người học',
  })
  @ApiOkEnvelope(ChangePasswordResponseDto)
  @ApiBadRequestResponse({
    description:
      'Mật khẩu xác nhận không khớp, trùng mật khẩu cũ hoặc tài khoản Google',
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Access token hoặc mật khẩu hiện tại không hợp lệ',
    type: ApiErrorResponseDto,
  })
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userAuthService.changePassword(user.id, dto);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Đăng xuất tài khoản khỏi tất cả thiết bị',
  })
  @ApiOkEnvelope(LogoutResponseDto)
  @ApiUnauthorizedResponse({
    description: 'Access token không hợp lệ hoặc đã hết hiệu lực',
    type: ApiErrorResponseDto,
  })
  logoutAll(@CurrentUser() user: AuthenticatedUser) {
    return this.userAuthService.logoutAll(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Lấy thông tin người học đang đăng nhập',
  })
  @ApiOkEnvelope(CurrentUserResponseDto)
  @ApiUnauthorizedResponse({
    description: 'Thiếu access token hoặc token không hợp lệ',
    type: ApiErrorResponseDto,
  })
  getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
