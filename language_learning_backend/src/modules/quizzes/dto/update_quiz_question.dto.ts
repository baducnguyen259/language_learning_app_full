import { PartialType } from '@nestjs/swagger';

import { CreateQuizQuestionDto } from './create_quiz_question.dto';

export class UpdateQuizQuestionDto extends PartialType(CreateQuizQuestionDto) {}
