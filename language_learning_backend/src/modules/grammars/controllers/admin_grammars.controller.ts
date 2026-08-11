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
import { CreateGrammarDto } from '../dto/create_grammar.dto';
import { GrammarQueryDto } from '../dto/grammar_query.dto';
import { GrammarResponseDto } from '../dto/grammar_response.dto';
import { UpdateGrammarDto } from '../dto/update_grammar.dto';
import { GrammarsService } from '../grammars.service';

@ApiTags('Admin Grammars')
@ApiBearerAuth('access-token')
@ApiAdminErrorResponses()
@Controller('admin/grammars')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminGrammarsController {
  constructor(private readonly grammarsService: GrammarsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách điểm ngữ pháp',
  })
  @ApiPaginatedEnvelope(GrammarResponseDto)
  findAll(@Query() query: GrammarQueryDto) {
    return this.grammarsService.findAllForAdmin(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết điểm ngữ pháp',
  })
  @ApiOkEnvelope(GrammarResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.grammarsService.findOneForAdmin(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo điểm ngữ pháp tiếng Hàn',
  })
  @ApiCreatedEnvelope(GrammarResponseDto)
  create(@Body() dto: CreateGrammarDto) {
    return this.grammarsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật điểm ngữ pháp',
  })
  @ApiOkEnvelope(GrammarResponseDto)
  @ApiNotFoundErrorResponse()
  update(@Param('id') id: string, @Body() dto: UpdateGrammarDto) {
    return this.grammarsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa điểm ngữ pháp',
  })
  @ApiOkEnvelope(GrammarResponseDto)
  @ApiNotFoundErrorResponse()
  remove(@Param('id') id: string) {
    return this.grammarsService.remove(id);
  }
}
