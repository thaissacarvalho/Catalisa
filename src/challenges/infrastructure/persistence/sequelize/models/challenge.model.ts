import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';

export default class ChallengeModel extends Model {
  declare id: number;
  declare code: string;
  declare title: string;
  declare description: string;
  declare status: ChallengeStatus;
  declare displayOrder: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ChallengeModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: ChallengeStatus.ACTIVE,
    },
    displayOrder: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      unique: true,
      validate: { min: 1 },
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'Challenge',
    tableName: 'challenges',
    indexes: [
      {
        name: 'challenges_status_display_order_index',
        fields: ['status', 'displayOrder'],
      },
    ],
  },
);
