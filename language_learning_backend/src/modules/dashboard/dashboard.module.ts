import { Module } from '@nestjs/common';
import { AdminDashboardController } from './controllers/admin_dashboard.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController, AdminDashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
