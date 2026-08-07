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
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../generated/prisma/enums';
import { LevelsService } from '../levels.service';
import { LevelQueryDto } from '../dto/level_query.dto';
import { UpdateLevelDto } from '../dto/update_level.dto';

@Controller('admin/levels')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLevelsController {
  constructor(private readonly levelsService: LevelsService) {}
  @Get()
  findAll(@Query() query: LevelQueryDto) {
    return this.levelsService.findAllForAdmin(query);
  }
  @Post()
  findOne(@Param('id') id: string) {
    return this.levelsService.findOneForAdmin(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLevelDto) {
    return this.levelsService.update(id, dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.levelsService.remove(id);
  }
}
