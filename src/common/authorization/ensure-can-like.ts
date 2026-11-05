import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

export function ensureCanLike(role: UserRole): void {
  if (role !== UserRole.PARTICIPANT && role !== UserRole.SUPER_ADMIN) {
    throw new AppHttpException(CatalisaCodes.FORBIDDEN);
  }
}
