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
import { CreateLessonDto } from '../dto/create_lesson.dto';
import { LessonQueryDto } from '../dto/lesson_query.dto';
import { UpdateLessonDto } from '../dto/update_lesson.dto';
import { LessonsService } from '../lessons.service';

@Controller('admin/lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll(@Query() query: LessonQueryDto) {
    return this.lessonsService.findAllForAdmin(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOneForAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
