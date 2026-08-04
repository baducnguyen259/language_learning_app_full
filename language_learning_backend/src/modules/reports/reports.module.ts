import { Module } from '@nestjs/common';
import { AdminReportsController } from './controllers/admin_reports.controller';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController, AdminReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
