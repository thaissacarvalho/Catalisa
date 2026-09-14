import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';

export default class SolutionModel extends Model {
  declare id: string;
  declare userCode: string;
  declare challengeId: number;
  declare title: string;
  declare description: string;
  declare status: SolutionStatus;
  declare moderationReason: string | null;
  declare moderatedByUserCode: string | null;
  declare moderatedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare author: UserModel;
  declare moderator: UserModel | null;
}

SolutionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userCode: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    challengeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SolutionStatus)),
      allowNull: false,
      defaultValue: SolutionStatus.PUBLISHED,
    },
    moderationReason: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    moderatedByUserCode: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    moderatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'Solution',
    tableName: 'solutions',
  },
);
