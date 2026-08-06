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

@Controller('admin/languages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLanguagesController {
  constructor(private readonly laguageService: LanguagesService) {}
  @Get()
  findAll(@Query() query: LanguageQueryDto) {
    return this.laguageService.findAllForAdmin(query);
  }
  @Get(':id')
  findOne(@Param(':id') id: string) {
    return this.laguageService.findOneForAdmin(id);
  }
  @Post() create(@Body() dto: CreateLanguageDto) {
    return this.laguageService.create(dto);
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: UpdateLanguageDto,
  ) {
    return this.laguageService.update(id, dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.laguageService.remove(id);
  }
}
