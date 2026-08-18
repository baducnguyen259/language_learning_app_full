import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { GrammarsModule } from './modules/grammars/grammars.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { LevelsModule } from './modules/levels/levels.module';
import { MediaModule } from './modules/media/media.module';
import { ProgressModule } from './modules/progress/progress.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { ReportsModule } from './modules/reports/reports.module';
import { TopicsModule } from './modules/topics/topics.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { VocabulariesModule } from './modules/vocabularies/vocabularies.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http_exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { CurriculumsModule } from './modules/curriculums/curriculums.module';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnvironment } from './config/env.validation';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: minutes(1),
          limit: 100,
        },
      ],
      errorMessage: 'Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    LanguagesModule,
    LevelsModule,
    CurriculumsModule,
    TopicsModule,
    LessonsModule,
    VocabulariesModule,
    GrammarsModule,
    QuizzesModule,
    ProgressModule,
    FavoritesModule,
    DashboardModule,
    ReportsModule,
    MediaModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
