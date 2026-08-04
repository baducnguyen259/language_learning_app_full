import { Module } from '@nestjs/common';
import { AdminProgressController } from './controllers/admin_progress.controller';
import { ProgressController } from './controllers/progress.controller';
import { ProgressService } from './progress.service';

@Module({
  controllers: [ProgressController, AdminProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
