import { UserEntity } from '@app/users/domain/entities/user.entity';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';

export class UserMapper {
  static toDomain(model: UserModel): UserEntity {
    return new UserEntity(
      model.id,
      model.name,
      model.email,
      model.status,
      model.role,
      model.jobPosition,
      model.enterprise,
      model.userCode,
    );
  }

  static toPersistence(user: UserEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      jobPosition: user.jobPosition,
      enterprise: user.enterprise,
      userCode: user.userCode,
    };
  }
}
