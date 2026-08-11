import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ApiNotFoundErrorResponse,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { GrammarQueryDto } from '../dto/grammar_query.dto';
import { GrammarResponseDto } from '../dto/grammar_response.dto';
import { GrammarsService } from '../grammars.service';

@ApiTags('Grammars')
@Controller('grammars')
export class GrammarsController {
  constructor(private readonly grammarsService: GrammarsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách điểm ngữ pháp đang hoạt động',
  })
  @ApiPaginatedEnvelope(GrammarResponseDto)
  findAll(@Query() query: GrammarQueryDto) {
    return this.grammarsService.findAllForApp(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết điểm ngữ pháp đang hoạt động',
  })
  @ApiOkEnvelope(GrammarResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.grammarsService.findOneForApp(id);
  }
}
