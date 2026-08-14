import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ApiArrayEnvelope,
  ApiNotFoundErrorResponse,
  ApiOkEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import {
  PublicQuizQuestionResponseDto,
  QuizAnswerResultResponseDto,
} from '../dto/quiz_response.dto';
import { SubmitQuizAnswerDto } from '../dto/submit_quiz_answer.dto';
import { QuizzesService } from '../quizzes.service';

@ApiTags('Quizzes')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Thiếu access token hoặc token không hợp lệ',
  type: ApiErrorResponseDto,
})
@ApiForbiddenResponse({
  description: 'Tài khoản không có quyền người học',
  type: ApiErrorResponseDto,
})
@Controller('quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
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
  @ApiBadRequestResponse({
    description: 'Đáp án không hợp lệ hoặc đây là câu hỏi phát âm',
    type: ApiErrorResponseDto,
  })
  submitAnswer(
    @Param('questionId') questionId: string,
    @Body() dto: SubmitQuizAnswerDto,
  ) {
    return this.quizzesService.submitAnswer(questionId, dto);
  }
}
