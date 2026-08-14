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
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ApiNotFoundErrorResponse,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/jwt_payload.interface';
import { FinishStudySessionDto } from '../dto/finish_study_session.dto';
import { ProgressQueryDto } from '../dto/progress_query.dto';
import { ProgressResponseDto } from '../dto/progress_response.dto';
import { StudySessionResponseDto } from '../dto/study_session_response.dto';
import { ProgressService } from '../progress.service';

@ApiTags('Progress')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Thiếu access token hoặc token không hợp lệ',
  type: ApiErrorResponseDto,
})
@ApiForbiddenResponse({
  description: 'Tài khoản không có quyền người học',
  type: ApiErrorResponseDto,
})
@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lessons/:lessonId/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bắt đầu hoặc tiếp tục một bài học' })
  @ApiOkEnvelope(ProgressResponseDto)
  @ApiNotFoundErrorResponse()
  startLesson(
    @CurrentUser() user: AuthenticatedUser,
    @Param('lessonId') lessonId: string,
  ) {
    return this.progressService.startLesson(user.id, lessonId);
  }

  @Post('lessons/:lessonId/sessions/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bắt đầu phiên học' })
  @ApiOkEnvelope(StudySessionResponseDto)
  @ApiNotFoundErrorResponse()
  @ApiConflictResponse({
    description: 'Người học đang có phiên học khác chưa kết thúc',
    type: ApiErrorResponseDto,
  })
  startStudySession(
    @CurrentUser() user: AuthenticatedUser,
    @Param('lessonId') lessonId: string,
  ) {
    return this.progressService.startStudySession(user.id, lessonId);
  }

  @Post('sessions/:sessionId/finish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kết thúc phiên học' })
  @ApiOkEnvelope(StudySessionResponseDto)
  @ApiNotFoundErrorResponse()
  finishStudySession(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
    @Body() dto: FinishStudySessionDto,
  ) {
    return this.progressService.finishStudySession(user.id, sessionId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tiến độ của người học' })
  @ApiPaginatedEnvelope(ProgressResponseDto)
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ProgressQueryDto,
  ) {
    return this.progressService.findAll(user.id, query);
  }

  @Get('lessons/:lessonId')
  @ApiOperation({ summary: 'Lấy tiến độ của một bài học' })
  @ApiOkEnvelope(ProgressResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('lessonId') lessonId: string,
  ) {
    return this.progressService.findOne(user.id, lessonId);
  }

  @Post('lessons/:lessonId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hoàn thành một bài học' })
  @ApiOkEnvelope(ProgressResponseDto)
  @ApiNotFoundErrorResponse()
  @ApiBadRequestResponse({
    description: 'Người học chưa trả lời đủ câu hỏi',
    type: ApiErrorResponseDto,
  })
  completeLesson(
    @CurrentUser() user: AuthenticatedUser,
    @Param('lessonId') lessonId: string,
  ) {
    return this.progressService.completeLesson(user.id, lessonId);
  }
}
