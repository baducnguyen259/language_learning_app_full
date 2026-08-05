import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import type { AuthenticatedUser } from '../interfaces/jwt_payload.interface';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.adminLogin(dto);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
