import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
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
  PracticeOverviewResponseDto,
  PracticeQuestionQueueResponseDto,
  PublicQuizQuestionResponseDto,
  QuizAnswerResultResponseDto,
} from '../dto/quiz_response.dto';
import { SubmitQuizAnswerDto } from '../dto/submit_quiz_answer.dto';
import { QuizzesService } from '../quizzes.service';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/jwt_payload.interface';
import { PracticeQuestionQueryDto } from '../dto/practice_question_query.dto';

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

  @Get('practice/overview')
  @ApiOperation({
    summary: 'Lấy tổng quan các chế độ luyện tập',
  })
  @ApiOkEnvelope(PracticeOverviewResponseDto)
  getPracticeOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.quizzesService.getPracticeOverview(user.id);
  }

  @Get('practice/questions')
  @ApiOperation({ summary: 'Lấy câu hỏi luyện tập theo kỹ năng' })
  @ApiOkEnvelope(PracticeQuestionQueueResponseDto)
  findPracticeQuestions(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PracticeQuestionQueryDto,
  ) {
    return this.quizzesService.findPracticeQuestions(user.id, query);
  }

  @Get('lessons/:lessonId/questions')
  @ApiOperation({ summary: 'Lấy bài luyện tập của một bài học' })
  @ApiArrayEnvelope(PublicQuizQuestionResponseDto)
  findQuestions(@Param('lessonId') lessonId: string) {
    return this.quizzesService.findQuestionsForApp(lessonId);
  }

  @Post('questions/:questionId/answer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Nộp và chấm đáp án một câu hỏi' })
  @ApiOkEnvelope(QuizAnswerResultResponseDto)
  @ApiNotFoundErrorResponse()
  @ApiBadRequestResponse({
    description: 'Đáp án không hợp lệ hoặc đây là câu hỏi phát âm',
    type: ApiErrorResponseDto,
  })
  submitAnswer(
    @CurrentUser() user: AuthenticatedUser,
    @Param('questionId') questionId: string,
    @Body() dto: SubmitQuizAnswerDto,
  ) {
    return this.quizzesService.submitAnswer(user.id, questionId, dto);
  }
}
