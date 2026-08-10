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
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CreateLessonDto } from '../dto/create_lesson.dto';
import { LessonQueryDto } from '../dto/lesson_query.dto';
import { UpdateLessonDto } from '../dto/update_lesson.dto';
import { LessonsService } from '../lessons.service';

@ApiTags('Admin Lessons')
@ApiBearerAuth('access-token')
@Controller('admin/lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài học' })
  findAll(@Query() query: LessonQueryDto) {
    return this.lessonsService.findAllForAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết bài học' })
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOneForAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo bài học' })
  create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bài học' })
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bài học' })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
