import { Module } from '@nestjs/common';
import { AdminLevelsController } from './controllers/admin_levels.controller';
import { LevelsController } from './controllers/levels.controller';
import { LevelsService } from './levels.service';

@Module({
  controllers: [LevelsController, AdminLevelsController],
  providers: [LevelsService],
  exports: [LevelsService],
})
export class LevelsModule {}
