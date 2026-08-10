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
import { BulkDeleteVocabularyDto } from '../dto/bulk_delete_vocabulary.dto';
import { CreateVocabularyDto } from '../dto/create_vocabulary.dto';
import { UpdateVocabularyDto } from '../dto/update_vocabulary.dto';
import { VocabularyQueryDto } from '../dto/vocabulary_query.dto';
import {
  BulkDeleteVocabularyResponseDto,
  VocabularyResponseDto,
} from '../dto/vocabulary_response.dto';
import { VocabulariesService } from '../vocabularies.service';

@ApiTags('Admin Vocabularies')
@ApiBearerAuth('access-token')
@ApiAdminErrorResponses()
@Controller('admin/vocabularies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminVocabulariesController {
  constructor(
    private readonly vocabulariesService: VocabulariesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách từ vựng' })
  @ApiPaginatedEnvelope(VocabularyResponseDto)
  findAll(@Query() query: VocabularyQueryDto) {
    return this.vocabulariesService.findAllForAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết từ vựng' })
  @ApiOkEnvelope(VocabularyResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.vocabulariesService.findOneForAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo từ vựng' })
  @ApiCreatedEnvelope(VocabularyResponseDto)
  create(@Body() dto: CreateVocabularyDto) {
    return this.vocabulariesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật từ vựng' })
  @ApiOkEnvelope(VocabularyResponseDto)
  @ApiNotFoundErrorResponse()
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVocabularyDto,
  ) {
    return this.vocabulariesService.update(id, dto);
  }

  @Delete('bulk')
  @ApiOperation({ summary: 'Xóa nhiều từ vựng' })
  @ApiOkEnvelope(BulkDeleteVocabularyResponseDto)
  @ApiNotFoundErrorResponse()
  removeMany(@Body() dto: BulkDeleteVocabularyDto) {
    return this.vocabulariesService.removeMany(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa từ vựng' })
  @ApiOkEnvelope(VocabularyResponseDto)
  @ApiNotFoundErrorResponse()
  remove(@Param('id') id: string) {
    return this.vocabulariesService.remove(id);
  }
}
