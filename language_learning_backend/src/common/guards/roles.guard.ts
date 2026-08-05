import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../../generated/prisma/enums';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

type AuthenticatedRequest = Request & {
  user?: {
    role: UserRole;
  };
};
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!user) {
      return false;
    }
    return requiredRoles.includes(user.role);
  }
}
