import { UserRole } from '../../../generated/prisma/enums';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
