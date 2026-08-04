import { Module } from '@nestjs/common';
import { AdminVocabulariesController } from './controllers/admin_vocabularies.controller';
import { VocabulariesController } from './controllers/vocabularies.controller';
import { VocabulariesService } from './vocabularies.service';

@Module({
  controllers: [VocabulariesController, AdminVocabulariesController],
  providers: [VocabulariesService],
  exports: [VocabulariesService],
})
export class VocabulariesModule {}
