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
import { CreateLanguageDto } from '../dto/create_language.dto';
import { LanguageQueryDto } from '../dto/language_query.dto';
import { LanguageResponseDto } from '../dto/language_response.dto';
import { UpdateLanguageDto } from '../dto/update_language.dto';
import { LanguagesService } from '../languages.service';

@ApiTags('Admin Languages')
@ApiBearerAuth('access-token')
@ApiAdminErrorResponses()
@Controller('admin/languages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách ngôn ngữ',
  })
  @ApiPaginatedEnvelope(LanguageResponseDto)
  findAll(@Query() query: LanguageQueryDto) {
    return this.languagesService.findAllForAdmin(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết ngôn ngữ',
  })
  @ApiOkEnvelope(LanguageResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.languagesService.findOneForAdmin(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo ngôn ngữ',
  })
  @ApiCreatedEnvelope(LanguageResponseDto)
  create(@Body() dto: CreateLanguageDto) {
    return this.languagesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật ngôn ngữ',
  })
  @ApiOkEnvelope(LanguageResponseDto)
  @ApiNotFoundErrorResponse()
  update(@Param('id') id: string, @Body() dto: UpdateLanguageDto) {
    return this.languagesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa ngôn ngữ',
  })
  @ApiOkEnvelope(LanguageResponseDto)
  @ApiNotFoundErrorResponse()
  remove(@Param('id') id: string) {
    return this.languagesService.remove(id);
  }
}
