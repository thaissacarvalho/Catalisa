import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';

export class UserEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public status: UserStatus,
    public readonly role: UserRole,
    public jobPosition: string,
    public enterprise: string,
    public readonly userCode: string,
  ) {}
}
