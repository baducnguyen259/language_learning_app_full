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
import { VocabulariesModule } from './modules/vocabularies/vocabularies.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    LanguagesModule,
    LevelsModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
