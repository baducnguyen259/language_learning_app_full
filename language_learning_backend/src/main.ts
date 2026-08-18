import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { requestIdMiddleware } from './common/middleware/request_id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const configService = app.get(ConfigService);

  const swaggerEnabled =
    configService.getOrThrow<string>('SWAGGER_ENABLED') === 'true';

  const corsOrigins = configService
    .getOrThrow<string>('CORS_ORIGINS')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.use(
    helmet({
      contentSecurityPolicy: swaggerEnabled ? false : undefined,
    }),
  );

  app.use(requestIdMiddleware);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Language Learning API')
      .setDescription('API quản trị và ứng dụng học ngôn ngữ')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập access token',
        },
        'access-token',
      )
      .build();

    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('docs', app, documentFactory, {
      useGlobalPrefix: true,
      customSiteTitle: 'Language Learning API',
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
}
void bootstrap();
