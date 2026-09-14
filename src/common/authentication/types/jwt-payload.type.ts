import { UserRole } from '@app/users/domain/enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  userCode: string;
  role: UserRole;
  mustChangePassword: boolean;
  credentialVersion: string | null;
  type: 'ACCESS';
  iat: number;
  exp: number;
}
