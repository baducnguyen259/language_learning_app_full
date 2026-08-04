import { Module } from '@nestjs/common';
import { AdminGrammarsController } from './controllers/admin_grammars.controller';
import { GrammarsController } from './controllers/grammars.controller';
import { GrammarsService } from './grammars.service';

@Module({
  controllers: [GrammarsController, AdminGrammarsController],
  providers: [GrammarsService],
  exports: [GrammarsService],
})
export class GrammarsModule {}
