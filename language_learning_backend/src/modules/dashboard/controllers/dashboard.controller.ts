import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { UserRole } from '../../../generated/prisma/enums';
import { DashboardService } from '../dashboard.service';
import {
  DailyGoalResponseDto,
  UserDashboardResponseDto,
} from '../dto/user_dashboard_response.dto';
import { UpdateDailyGoalDto } from '../dto/update_daily_goal.dto';
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import type { AuthenticatedUser } from '../../auth/interfaces/jwt_payload.interface';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';

@ApiTags('User Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOkResponse({
    type: UserDashboardResponseDto,
  })
  @ApiUnauthorizedResponse({
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({
    type: ApiErrorResponseDto,
  })
  getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getUserDashboard(user.id);
  }

  @Patch('daily-goal')
  @ApiOkResponse({
    type: DailyGoalResponseDto,
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    type: ApiErrorResponseDto,
  })
  @ApiForbiddenResponse({
    type: ApiErrorResponseDto,
  })
  updateDailyGoal(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateDailyGoalDto,
  ) {
    return this.dashboardService.updateDailyGoal(user.id, dto);
  }
}
