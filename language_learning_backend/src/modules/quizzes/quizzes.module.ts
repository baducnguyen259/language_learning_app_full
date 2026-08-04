import { Module } from '@nestjs/common';
import { AdminQuizzesController } from './controllers/admin_quizzes.controller';
import { QuizzesController } from './controllers/quizzes.controller';
import { QuizzesService } from './quizzes.service';

@Module({
  controllers: [QuizzesController, AdminQuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
