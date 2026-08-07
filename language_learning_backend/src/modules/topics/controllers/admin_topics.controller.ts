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
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CreateTopicDto } from '../dto/create_topic.dto';
import { TopicQueryDto } from '../dto/topic_query.dto';
import { UpdateTopicDto } from '../dto/update_topic.dto';
import { TopicsService } from '../topics.service';

@Controller('admin/topics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminTopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  findAll(@Query() query: TopicQueryDto) {
    return this.topicsService.findAllForAdmin(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOneForAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateTopicDto) {
    return this.topicsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.topicsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }
}
