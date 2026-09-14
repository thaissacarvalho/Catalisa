import { UserEntity } from '@app/users/domain/entities/user.entity';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';

export interface UserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByUserCode(userCode: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  existsByRole(role: UserRole): Promise<boolean>;
  updateStatusByUserCode(
    userCode: string,
    status: UserStatus,
  ): Promise<UserEntity | null>;
}
