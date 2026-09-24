import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

export function ensureParticipant(role: UserRole): void {
  if (role !== UserRole.PARTICIPANT) {
    throw new AppHttpException(TokenCodes.FORBIDDEN);
  }
}
