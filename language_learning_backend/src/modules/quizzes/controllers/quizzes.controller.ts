import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ApiArrayEnvelope,
  ApiNotFoundErrorResponse,
  ApiOkEnvelope,
} from '../../../common/decorators/api_response.decorator';
import {
  PublicQuizQuestionResponseDto,
  QuizAnswerResultResponseDto,
} from '../dto/quiz_response.dto';
import { SubmitQuizAnswerDto } from '../dto/submit_quiz_answer.dto';
import { QuizzesService } from '../quizzes.service';

@ApiTags('Quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('lessons/:lessonId/questions')
  @ApiOperation({
    summary: 'Lấy bài luyện tập của một bài học',
  })
  @ApiArrayEnvelope(PublicQuizQuestionResponseDto)
  findQuestions(@Param('lessonId') lessonId: string) {
    return this.quizzesService.findQuestionsForApp(lessonId);
  }

  @Post('questions/:questionId/answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Nộp và chấm đáp án một câu hỏi',
  })
  @ApiOkEnvelope(QuizAnswerResultResponseDto)
  @ApiNotFoundErrorResponse()
  submitAnswer(
    @Param('questionId') questionId: string,
    @Body() dto: SubmitQuizAnswerDto,
  ) {
    return this.quizzesService.submitAnswer(questionId, dto);
  }
}
