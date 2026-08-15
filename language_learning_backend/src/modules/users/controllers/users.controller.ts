import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ApiNotFoundErrorResponse,
  ApiOkEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/jwt_payload.interface';
import { MyProfileResponseDto } from '../dto/my_profile_response.dto';
import { UpdateMyProfileDto } from '../dto/update_my_profile.dto';
import { UsersService } from '../users.service';

@ApiTags('User Profile')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Thiếu access token hoặc token không hợp lệ',
  type: ApiErrorResponseDto,
})
@ApiForbiddenResponse({
  description: 'Tài khoản không có quyền người học',
  type: ApiErrorResponseDto,
})
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Lấy hồ sơ người học hiện tại',
  })
  @ApiOkEnvelope(MyProfileResponseDto)
  @ApiNotFoundErrorResponse()
  getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getMyProfile(user.id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Cập nhật hồ sơ người học hiện tại',
  })
  @ApiOkEnvelope(MyProfileResponseDto)
  @ApiBadRequestResponse({
    description: 'Tên người dùng không hợp lệ',
    type: ApiErrorResponseDto,
  })
  @ApiNotFoundErrorResponse()
  updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateMyProfileDto,
  ) {
    return this.usersService.updateMyProfile(user.id, dto);
  }
}
