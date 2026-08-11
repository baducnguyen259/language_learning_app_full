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
import { CreateQuizDto } from '../dto/create_quiz.dto';
import { CreateQuizQuestionDto } from '../dto/create_quiz_question.dto';
import { QuizQueryDto } from '../dto/quiz_query.dto';
import {
  AdminQuizQuestionResponseDto,
  QuizResponseDto,
} from '../dto/quiz_response.dto';
import { UpdateQuizDto } from '../dto/update_quiz.dto';
import { UpdateQuizQuestionDto } from '../dto/update_quiz_question.dto';
import { QuizzesService } from '../quizzes.service';

@ApiTags('Admin Quizzes')
@ApiBearerAuth('access-token')
@ApiAdminErrorResponses()
@Controller('admin/quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminQuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách bài kiểm tra',
  })
  @ApiPaginatedEnvelope(QuizResponseDto)
  findAll(@Query() query: QuizQueryDto) {
    return this.quizzesService.findAllForAdmin(query);
  }

  @Get('questions/:questionId')
  @ApiOperation({
    summary: 'Lấy chi tiết một câu hỏi',
  })
  @ApiOkEnvelope(AdminQuizQuestionResponseDto)
  @ApiNotFoundErrorResponse()
  findQuestion(@Param('questionId') questionId: string) {
    return this.quizzesService.findQuestionForAdmin(questionId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết bài kiểm tra',
  })
  @ApiOkEnvelope(QuizResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOneForAdmin(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo bài kiểm tra',
  })
  @ApiCreatedEnvelope(QuizResponseDto)
  create(@Body() dto: CreateQuizDto) {
    return this.quizzesService.create(dto);
  }

  @Post(':quizId/questions')
  @ApiOperation({
    summary: 'Thêm câu hỏi vào bài kiểm tra',
  })
  @ApiCreatedEnvelope(AdminQuizQuestionResponseDto)
  @ApiNotFoundErrorResponse()
  createQuestion(
    @Param('quizId') quizId: string,
    @Body() dto: CreateQuizQuestionDto,
  ) {
    return this.quizzesService.createQuestion(quizId, dto);
  }

  @Patch('questions/:questionId')
  @ApiOperation({
    summary: 'Cập nhật câu hỏi',
  })
  @ApiOkEnvelope(AdminQuizQuestionResponseDto)
  @ApiNotFoundErrorResponse()
  updateQuestion(
    @Param('questionId') questionId: string,
    @Body() dto: UpdateQuizQuestionDto,
  ) {
    return this.quizzesService.updateQuestion(questionId, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật bài kiểm tra',
  })
  @ApiOkEnvelope(QuizResponseDto)
  @ApiNotFoundErrorResponse()
  update(@Param('id') id: string, @Body() dto: UpdateQuizDto) {
    return this.quizzesService.update(id, dto);
  }

  @Delete('questions/:questionId')
  @ApiOperation({
    summary: 'Xóa câu hỏi',
  })
  @ApiOkEnvelope(AdminQuizQuestionResponseDto)
  @ApiNotFoundErrorResponse()
  removeQuestion(@Param('questionId') questionId: string) {
    return this.quizzesService.removeQuestion(questionId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa bài kiểm tra',
  })
  @ApiOkEnvelope(QuizResponseDto)
  @ApiNotFoundErrorResponse()
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }
}
