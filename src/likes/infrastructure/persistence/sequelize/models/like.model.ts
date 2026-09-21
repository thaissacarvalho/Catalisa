import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import SolutionModel from '@app/solutions/infrastructure/persistence/sequelize/models/solution.model';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';

export default class LikeModel extends Model {}

LikeModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    solutionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SolutionModel,
        key: 'id',
      },
    },
    userCode: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: {
        model: UserModel,
        key: 'userCode',
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'Like',
    tableName: 'likes',
  },
);
