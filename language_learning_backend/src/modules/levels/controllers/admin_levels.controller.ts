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
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../generated/prisma/enums';
import { LevelsService } from '../levels.service';
import { CreateLevelDto } from '../dto/create_level.dto';
import { LevelQueryDto } from '../dto/level_query.dto';
import { UpdateLevelDto } from '../dto/update_level.dto';
import {
  ApiAdminErrorResponses,
  ApiCreatedEnvelope,
  ApiNotFoundErrorResponse,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { LevelResponseDto } from '../dto/level_response.dto';

@ApiTags('Admin Levels')
@ApiBearerAuth('access-token')
@ApiAdminErrorResponses()
@Controller('admin/levels')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách cấp độ' })
  @ApiPaginatedEnvelope(LevelResponseDto)
  findAll(@Query() query: LevelQueryDto) {
    return this.levelsService.findAllForAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết cấp độ' })
  @ApiOkEnvelope(LevelResponseDto)
  @ApiNotFoundErrorResponse()
  findOne(@Param('id') id: string) {
    return this.levelsService.findOneForAdmin(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo cấp độ' })
  @ApiCreatedEnvelope(LevelResponseDto)
  create(@Body() dto: CreateLevelDto) {
    return this.levelsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật cấp độ' })
  @ApiOkEnvelope(LevelResponseDto)
  @ApiNotFoundErrorResponse()
  update(@Param('id') id: string, @Body() dto: UpdateLevelDto) {
    return this.levelsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa cấp độ' })
  @ApiOkEnvelope(LevelResponseDto)
  @ApiNotFoundErrorResponse()
  remove(@Param('id') id: string) {
    return this.levelsService.remove(id);
  }
}
