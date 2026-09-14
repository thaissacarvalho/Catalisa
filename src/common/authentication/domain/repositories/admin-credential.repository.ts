import { AdminCredentialEntity } from '@app/common/authentication/domain/entities/admin-credential.entity';
import { UserEntity } from '@app/users/domain/entities/user.entity';

export const ADMIN_CREDENTIAL_REPOSITORY = 'AdminCredentialRepository';

export interface AdminCredentialRepository {
  findByUserId(userId: string): Promise<AdminCredentialEntity | null>;
  promoteParticipantToAdmin(
    userId: string,
    passwordHash: string,
  ): Promise<AdminCredentialEntity | null>;
  updatePassword(
    userId: string,
    passwordHash: string,
  ): Promise<AdminCredentialEntity | null>;
  createInitialSuperAdmin(
    user: UserEntity,
    passwordHash: string,
  ): Promise<AdminCredentialEntity>;
}
