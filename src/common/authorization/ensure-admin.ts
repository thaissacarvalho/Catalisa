import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

export function ensureAdmin(role: UserRole): void {
  if (role !== UserRole.ADMIN && role !== UserRole.SUPER_ADMIN) {
    throw new AppHttpException(TokenCodes.FORBIDDEN);
  }
}