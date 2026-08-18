import { plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

enum Environment {
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(postgresql|postgres):\/\//, {
    message: 'DATABASE_URL phải bắt đầu bằng postgresql:// hoặc postgres://',
  })
  DATABASE_URL!: string;

  @IsString()
  @MinLength(32, {
    message: 'JWT_SECRET phải có ít nhất 32 ký tự',
  })
  JWT_SECRET!: string;

  @IsString()
  @Matches(/^\d+(ms|s|m|h|d|w)$/, {
    message: 'JWT_EXPIRES_IN phải có dạng 15m, 1h hoặc 1d',
  })
  JWT_EXPIRES_IN!: string;

  @IsInt()
  @Min(1)
  @Max(365)
  REFRESH_TOKEN_EXPIRES_IN_DAYS!: number;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID!: string;

  @IsString()
  @IsNotEmpty()
  SMTP_HOST!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  SMTP_PORT!: number;

  @IsString()
  @IsIn(['true', 'false'])
  SMTP_SECURE!: string;

  @IsEmail()
  SMTP_USER!: string;

  @IsString()
  @IsNotEmpty()
  SMTP_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM!: string;

  @IsString()
  @IsIn(['true', 'false'])
  SWAGGER_ENABLED!: string;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGINS!: string;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    {
      NODE_ENV: 'development',
      PORT: 3000,
      JWT_EXPIRES_IN: '15m',
      REFRESH_TOKEN_EXPIRES_IN_DAYS: 30,
      SMTP_SECURE: 'true',
      SWAGGER_ENABLED: 'true',
      ...config,
    },
    { enableImplicitConversion: true },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );
    throw new Error(`Cấu hình môi trường không hợp lệ: ${messages.join('; ')}`);
  }

  return validatedConfig;
}
