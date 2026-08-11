import { Module } from '@nestjs/common';
import type { StringValue } from 'ms';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthController } from './controllers/admin_auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminAuthService } from './services/admin_auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_EXPIRES_IN',
            '1d',
          ) as StringValue,
        },
      }),
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AuthService, JwtStrategy, AdminAuthService],
  exports: [AdminAuthService, JwtModule],
})
export class AuthModule {}
