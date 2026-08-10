import {
  Controller,
  Query,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { LanguagesService } from '../languages.service';
import { LanguageQueryDto } from '../dto/language_query.dto';
import { CreateLanguageDto } from '../dto/create_language.dto';
import { UpdateLanguageDto } from '../dto/update_language.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Languages')
@ApiBearerAuth('access-token')
@Controller('admin/languages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLanguagesController {
  constructor(private readonly laguageService: LanguagesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách ngôn ngữ',
  })
  findAll(@Query() query: LanguageQueryDto) {
    return this.laguageService.findAllForAdmin(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết ngôn ngữ',
  })
  findOne(@Param(':id') id: string) {
    return this.laguageService.findOneForAdmin(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo ngôn ngữ',
  })
  create(@Body() dto: CreateLanguageDto) {
    return this.laguageService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật ngôn ngữ',
  })
  update(@Param('id') id: string, @Body() dto: UpdateLanguageDto) {
    return this.laguageService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa ngôn ngữ',
  })
  remove(@Param('id') id: string) {
    return this.laguageService.remove(id);
  }
}
