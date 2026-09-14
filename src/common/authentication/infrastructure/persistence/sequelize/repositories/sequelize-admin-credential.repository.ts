import { AdminCredentialEntity } from '@app/common/authentication/domain/entities/admin-credential.entity';
import { AdminCredentialRepository } from '@app/common/authentication/domain/repositories/admin-credential.repository';
import { sequelize } from '@app/database/sequelize';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import AdminCredentialModel from '../models/admin-credential.model';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { randomUUID } from 'node:crypto';

export class SequelizeAdminCredentialRepository implements AdminCredentialRepository {
  async findByUserId(userId: string): Promise<AdminCredentialEntity | null> {
    const credential = await AdminCredentialModel.findOne({
      where: { userId },
    });

    return credential ? this.toDomain(credential) : null;
  }

  async promoteParticipantToAdmin(
    userId: string,
    passwordHash: string,
  ): Promise<AdminCredentialEntity | null> {
    return sequelize.transaction(async (transaction) => {
      const [updatedUsers] = await UserModel.update(
        { role: UserRole.ADMIN },
        {
          where: { id: userId, role: UserRole.PARTICIPANT },
          transaction,
        },
      );

      if (updatedUsers === 0) {
        return null;
      }

      const credential = await AdminCredentialModel.create(
        {
          id: randomUUID(),
          userId,
          passwordHash,
          mustChangePassword: true,
          passwordChangedAt: null,
        },
        { transaction },
      );

      return this.toDomain(credential);
    });
  }

  async updatePassword(
    userId: string,
    passwordHash: string,
  ): Promise<AdminCredentialEntity | null> {
    return sequelize.transaction(async (transaction) => {
      const credential = await AdminCredentialModel.findOne({
        where: { userId },
        transaction,
      });

      if (!credential) {
        return null;
      }

      credential.passwordHash = passwordHash;
      credential.mustChangePassword = false;
      credential.passwordChangedAt = new Date();
      await credential.save({ transaction });

      return this.toDomain(credential);
    });
  }

  private toDomain(model: AdminCredentialModel): AdminCredentialEntity {
    return new AdminCredentialEntity(
      model.id,
      model.userId,
      model.passwordHash,
      model.mustChangePassword,
      model.passwordChangedAt,
    );
  }

  async createInitialSuperAdmin(
    user: UserEntity,
    passwordHash: string,
  ): Promise<AdminCredentialEntity> {
    return sequelize.transaction(async (transaction) => {
      await UserModel.create(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          role: user.role,
          jobPosition: user.jobPosition,
          enterprise: user.enterprise,
          userCode: user.userCode,
        },
        { transaction },
      );

      const credential = await AdminCredentialModel.create(
        {
          id: randomUUID(),
          userId: user.id,
          passwordHash,
          mustChangePassword: true,
          passwordChangedAt: null,
        },
        { transaction },
      );

      return this.toDomain(credential);
    });
  }
}
