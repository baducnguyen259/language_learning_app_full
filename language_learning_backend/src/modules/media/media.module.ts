import { Module } from '@nestjs/common';
import { AdminMediaController } from './controllers/admin_media.controller';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController, AdminMediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
