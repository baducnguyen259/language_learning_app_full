import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiAdminErrorResponses,
  ApiCreatedEnvelope,
  ApiNotFoundErrorResponse,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CreateTopicDto } from '../dto/create_topic.dto';
import { TopicQueryDto } from '../dto/topic_query.dto';
import { TopicResponseDto } from '../dto/topic_response.dto';
import { UpdateTopicDto } from '../dto/update_topic.dto';
import { TopicsService } from '../topics.service';

@ApiTags('Admin Topics')
@ApiBearerAuth('access-token')
@ApiAdminErrorResponses()
@Controller('admin/topics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminTopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách chủ đề' })
  @ApiPaginatedEnvelope(TopicResponseDto)
  findAll(@Query() query: TopicQueryDto) {
    return this.topicsService.findAllForAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết chủ đề' })
  @ApiOkEnvelope(TopicResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.topicsService.findOneForAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo chủ đề' })
  @ApiCreatedEnvelope(TopicResponseDto)
  create(@Body() dto: CreateTopicDto) {
    return this.topicsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật chủ đề' })
  @ApiOkEnvelope(TopicResponseDto)
  @ApiNotFoundErrorResponse()
  update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.topicsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa chủ đề' })
  @ApiOkEnvelope(TopicResponseDto)
  @ApiNotFoundErrorResponse()
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }
}
