import { Module } from '@nestjs/common';
import { AdminAuthController } from './controllers/admin_auth.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController, AdminAuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
