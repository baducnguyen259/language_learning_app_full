import { Module } from '@nestjs/common';
import { AdminLessonsController } from './controllers/admin_lessons.controller';
import { LessonsController } from './controllers/lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  controllers: [LessonsController, AdminLessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
