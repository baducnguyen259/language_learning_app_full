import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
  ApiNotFoundErrorResponse,
  ApiOkEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/jwt_payload.interface';
import { UpdateVocabularyLearningStatusDto } from '../dto/update_vocabulary_learning_status.dto';
import { UserVocabularyQueryDto } from '../dto/user_vocabulary_query.dto';
import {
  UserVocabularyLearningStatusResponseDto,
  UserVocabularyListResponseDto,
  UserVocabularyReviewQueueResponseDto,
} from '../dto/user_vocabulary_response.dto';
import { VocabulariesService } from '../vocabularies.service';
import { VocabularyReviewQueryDto } from '../dto/vocabulary_review_query.dto';

@ApiTags('Vocabularies')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Thiếu access token hoặc token không hợp lệ',
  type: ApiErrorResponseDto,
})
@ApiForbiddenResponse({
  description: 'Tài khoản không có quyền người học',
  type: ApiErrorResponseDto,
})
@Controller('vocabularies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class VocabulariesController {
  constructor(private readonly vocabulariesService: VocabulariesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách từ vựng của người học' })
  @ApiOkEnvelope(UserVocabularyListResponseDto)
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: UserVocabularyQueryDto,
  ) {
    return this.vocabulariesService.findAllForApp(user.id, query);
  }

  @Get('review')
  @ApiOperation({
    summary: 'Lấy danh sách từ vựng ôn tập nhanh',
  })
  @ApiOkEnvelope(UserVocabularyReviewQueueResponseDto)
  findReviewQueue(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: VocabularyReviewQueryDto,
  ) {
    return this.vocabulariesService.findReviewQueue(user.id, query);
  }

  @Patch(':vocabularyId/learning-status')
  @ApiOperation({ summary: 'Cập nhật trạng thái học của từ vựng' })
  @ApiOkEnvelope(UserVocabularyLearningStatusResponseDto)
  @ApiBadRequestResponse({
    description: 'Trạng thái học không hợp lệ',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundErrorResponse()
  updateLearningStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vocabularyId') vocabularyId: string,
    @Body() dto: UpdateVocabularyLearningStatusDto,
  ) {
    return this.vocabulariesService.updateLearningStatus(
      user.id,
      vocabularyId,
      dto,
    );
  }
}
