import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';

import { AdminAuthController } from './controllers/admin_auth.controller';
import { UserAuthController } from './controllers/user_auth.controller';
import { AdminAuthService } from './services/admin_auth.service';
import { UserAuthService } from './services/user_auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleAuthService } from './services/google_auth.service';
import { TokenService } from './services/token.service';

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
  controllers: [AdminAuthController, UserAuthController],
  providers: [
    AdminAuthService,
    UserAuthService,
    JwtStrategy,
    GoogleAuthService,
    TokenService,
  ],
  exports: [
    AdminAuthService,
    UserAuthService,
    JwtModule,
    GoogleAuthService,
    TokenService,
  ],
})
export class AuthModule {}
