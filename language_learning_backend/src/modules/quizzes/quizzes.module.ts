import { Module } from '@nestjs/common';
import { AdminQuizzesController } from './controllers/admin_quizzes.controller';
import { QuizzesController } from './controllers/quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [ProgressModule],
  controllers: [QuizzesController, AdminQuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
