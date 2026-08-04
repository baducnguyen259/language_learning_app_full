import { Module } from '@nestjs/common';
import { AdminTopicsController } from './controllers/admin_topics.controller';
import { TopicsController } from './controllers/topics.controller';
import { TopicsService } from './topics.service';

@Module({
  controllers: [TopicsController, AdminTopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}
