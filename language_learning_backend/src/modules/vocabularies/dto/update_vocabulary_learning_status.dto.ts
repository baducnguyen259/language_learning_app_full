import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { VocabularyLearningStatus } from '../../../generated/prisma/enums';

export class UpdateVocabularyLearningStatusDto {
  @ApiProperty({
    enum: VocabularyLearningStatus,
    example: VocabularyLearningStatus.MASTERED,
  })
  @IsEnum(VocabularyLearningStatus)
  learningStatus!: VocabularyLearningStatus;
}
