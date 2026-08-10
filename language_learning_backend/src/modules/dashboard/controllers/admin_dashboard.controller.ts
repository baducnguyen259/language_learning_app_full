import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiAdminErrorResponses,
  ApiOkEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { DashboardService } from '../dashboard.service';
import { DashboardResponseDto } from '../dto/dashboard_response.dto';

@ApiTags('Admin Dashboard')
@ApiBearerAuth('access-token')
@ApiAdminErrorResponses()
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy dữ liệu tổng quan quản trị' })
  @ApiOkEnvelope(DashboardResponseDto)
  getOverview() {
    return this.dashboardService.getAdminOverview();
  }
}
