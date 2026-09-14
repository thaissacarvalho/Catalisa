import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';

export default class ChallengeModel extends Model {
  declare id: string;
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
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'Challenges',
    tableName: 'challenges',
  },
);
