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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { CurriculumsService } from '../curriculums.service';
import { AssignLessonDto } from '../dto/assign_lesson.dto';
import { CreateChapterDto } from '../dto/create_chapter.dto';
import { CreateCurriculumDto } from '../dto/create_curriculum.dto';
import { CurriculumQueryDto } from '../dto/curriculum_query.dto';
import {
  ChapterLessonResponseDto,
  ChapterResponseDto,
  CurriculumResponseDto,
} from '../dto/curriculum_response.dto';
import { UpdateChapterDto } from '../dto/update_chapter.dto';
import { UpdateCurriculumDto } from '../dto/update_curriculum.dto';

@ApiTags('Admin Curriculums')
@ApiBearerAuth('access-token')
@ApiAdminErrorResponses()
@Controller('admin/curriculums')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCurriculumsController {
  constructor(private readonly curriculumsService: CurriculumsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lộ trình' })
  @ApiPaginatedEnvelope(CurriculumResponseDto)
  findAll(@Query() query: CurriculumQueryDto) {
    return this.curriculumsService.findAllForAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết lộ trình' })
  @ApiOkEnvelope(CurriculumResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.curriculumsService.findOneForAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo lộ trình' })
  @ApiCreatedEnvelope(CurriculumResponseDto)
  create(@Body() dto: CreateCurriculumDto) {
    return this.curriculumsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lộ trình' })
  @ApiOkEnvelope(CurriculumResponseDto)
  @ApiNotFoundErrorResponse()
  update(@Param('id') id: string, @Body() dto: UpdateCurriculumDto) {
    return this.curriculumsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lộ trình' })
  @ApiOkEnvelope(CurriculumResponseDto)
  @ApiNotFoundErrorResponse()
  remove(@Param('id') id: string) {
    return this.curriculumsService.remove(id);
  }

  @Post(':id/chapters')
  @ApiOperation({ summary: 'Tạo chương trong lộ trình' })
  @ApiCreatedEnvelope(ChapterResponseDto)
  @ApiNotFoundErrorResponse()
  createChapter(
    @Param('id') curriculumId: string,
    @Body() dto: CreateChapterDto,
  ) {
    return this.curriculumsService.createChapter(curriculumId, dto);
  }

  @Patch(':id/chapters/:chapterId')
  @ApiOperation({ summary: 'Cập nhật chương' })
  @ApiOkEnvelope(ChapterResponseDto)
  @ApiNotFoundErrorResponse()
  updateChapter(
    @Param('id') curriculumId: string,
    @Param('chapterId') chapterId: string,
    @Body() dto: UpdateChapterDto,
  ) {
    return this.curriculumsService.updateChapter(curriculumId, chapterId, dto);
  }

  @Delete(':id/chapters/:chapterId')
  @ApiOperation({ summary: 'Xóa chương và gỡ các bài học khỏi chương' })
  @ApiOkEnvelope(ChapterResponseDto)
  @ApiNotFoundErrorResponse()
  removeChapter(
    @Param('id') curriculumId: string,
    @Param('chapterId') chapterId: string,
  ) {
    return this.curriculumsService.removeChapter(curriculumId, chapterId);
  }

  @Post(':id/chapters/:chapterId/lessons')
  @ApiOperation({ summary: 'Gán bài học vào chương' })
  @ApiOkEnvelope(ChapterLessonResponseDto)
  @ApiNotFoundErrorResponse()
  assignLesson(
    @Param('id') curriculumId: string,
    @Param('chapterId') chapterId: string,
    @Body() dto: AssignLessonDto,
  ) {
    return this.curriculumsService.assignLesson(curriculumId, chapterId, dto);
  }

  @Delete(':id/chapters/:chapterId/lessons/:lessonId')
  @ApiOperation({ summary: 'Gỡ bài học khỏi chương' })
  @ApiOkEnvelope(ChapterLessonResponseDto)
  @ApiNotFoundErrorResponse()
  removeLesson(
    @Param('id') curriculumId: string,
    @Param('chapterId') chapterId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.curriculumsService.removeLesson(
      curriculumId,
      chapterId,
      lessonId,
    );
  }
}
