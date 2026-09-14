import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserEntity } from '@app/users/domain/entities/user.entity';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';
import { UserMapper } from '@app/users/infrastructure/persistence/sequelize/mappers/user.mapper';

export class SequelizeUserRepository implements UserRepository {
  async create(user: UserEntity): Promise<UserEntity> {
    const model = await UserModel.create(UserMapper.toPersistence(user));

    return UserMapper.toDomain(model);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await UserModel.findAll();

    return users.map(UserMapper.toDomain);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await UserModel.findByPk(id);

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByUserCode(userCode: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ where: { userCode } });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ where: { email } });

    return user ? UserMapper.toDomain(user) : null;
  }

  async existsByRole(role: UserRole): Promise<boolean> {
    const total = await UserModel.count({
      where: { role },
    });

    return total > 0;
  }

  async updateStatusByUserCode(
    userCode: string,
    status: UserStatus,
  ): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ where: { userCode } });

    if (!user) {
      return null;
    }

    user.status = status;
    await user.save();

    return UserMapper.toDomain(user);
  }
}
