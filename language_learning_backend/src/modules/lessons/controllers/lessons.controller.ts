import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
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
import { Roles } from '../../../common/decorators/roles.decorator';
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AppLessonDetailResponseDto } from '../dto/app_lesson_detail_response.dto';
import { LessonsService } from '../lessons.service';

@ApiTags('Lessons')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Thiếu access token hoặc token không hợp lệ',
  type: ApiErrorResponseDto,
})
@ApiForbiddenResponse({
  description: 'Tài khoản không có quyền người học',
  type: ApiErrorResponseDto,
})
@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy nội dung chi tiết một bài học',
  })
  @ApiOkEnvelope(AppLessonDetailResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOneForApp(id);
  }
}
