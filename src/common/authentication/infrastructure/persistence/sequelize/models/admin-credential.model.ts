import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';

export default class AdminCredentialModel extends Model {
  declare id: string;
  declare userId: string;
  declare passwordHash: string;
  declare mustChangePassword: boolean;
  declare passwordChangedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AdminCredentialModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'user_id',
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'must_change_password',
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'password_changed_at',
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'AdminCredential',
    tableName: 'admin_credentials',
  },
);
