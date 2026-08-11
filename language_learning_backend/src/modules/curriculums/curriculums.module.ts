import { Module } from '@nestjs/common';
import { AdminCurriculumsController } from './controllers/admin_curriculums.controller';
import { CurriculumsController } from './controllers/curriculums.controller';
import { CurriculumsService } from './curriculums.service';

@Module({
  controllers: [CurriculumsController, AdminCurriculumsController],
  providers: [CurriculumsService],
  exports: [CurriculumsService],
})
export class CurriculumsModule {}
