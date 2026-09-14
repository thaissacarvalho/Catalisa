import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import SolutionModel from '@app/solutions/infrastructure/persistence/sequelize/models/solution.model';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';

export default class LikeModel extends Model {}

LikeModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    solutionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SolutionModel,
        key: 'id',
      },
    },
    userCode: {
      type: DataTypes.STRING(150),
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
