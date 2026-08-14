import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
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
import { CurriculumsService } from '../curriculums.service';
import { AppCurriculumQueryDto } from '../dto/app_curriculum_query.dto';
import { AppCurriculumResponseDto } from '../dto/app_curriculum_response.dto';

@ApiTags('Curriculums')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Thiếu access token hoặc token không hợp lệ',
  type: ApiErrorResponseDto,
})
@ApiForbiddenResponse({
  description: 'Tài khoản không có quyền người học',
  type: ApiErrorResponseDto,
})
@Controller('curriculums')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class CurriculumsController {
  constructor(private readonly curriculumsService: CurriculumsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách lộ trình đang được xuất bản',
  })
  @ApiArrayEnvelope(AppCurriculumResponseDto)
  findAll(@Query() query: AppCurriculumQueryDto) {
    return this.curriculumsService.findAllForApp(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết lộ trình đang được xuất bản',
  })
  @ApiOkEnvelope(AppCurriculumResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.curriculumsService.findOneForApp(id);
  }
}
