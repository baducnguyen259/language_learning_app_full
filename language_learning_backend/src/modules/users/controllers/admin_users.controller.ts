import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/jwt_payload.interface';
import { UpdateUserDto } from '../dto/update_user.dto';
import { UpdateUserStatusDto } from '../dto/update_user_status.dto';
import { UserQueryDto } from '../dto/user_query.dto';
import { UsersService } from '../users.service';

@ApiTags('Admin Users')
@ApiBearerAuth('access-token')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAllForAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết người dùng' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOneForAdmin(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentAdmin: AuthenticatedUser,
  ) {
    return this.usersService.update(id, dto, currentAdmin.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Khóa hoặc mở khóa người dùng' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() currentAdmin: AuthenticatedUser,
  ) {
    return this.usersService.updateStatus(id, dto, currentAdmin.id);
  }
}
