import { Module } from '@nestjs/common';
import { AdminLanguagesController } from './controllers/admin_languages.controller';
import { LanguagesController } from './controllers/languages.controller';
import { LanguagesService } from './languages.service';

@Module({
  controllers: [LanguagesController, AdminLanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService],
})
export class LanguagesModule {}
