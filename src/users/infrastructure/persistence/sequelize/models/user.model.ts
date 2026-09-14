import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';

export default class UserModel extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare status: UserStatus;
  declare role: UserRole;
  declare jobPosition: string;
  declare enterprise: string;
  declare userCode: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED', 'SUSPENDED'),
      allowNull: false,
      defaultValue: UserStatus.ACTIVE,
    },
    role: {
      type: DataTypes.ENUM('PARTICIPANT', 'ADMIN', 'SUPER_ADMIN'),
      allowNull: false,
      defaultValue: UserRole.PARTICIPANT,
    },
    jobPosition: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    enterprise: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    userCode: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'User',
    tableName: 'users',
  },
);
