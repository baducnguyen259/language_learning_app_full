import { Controller, UseGuards } from '@nestjs/common';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

@Controller('admin/languages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLanguagesController {}
