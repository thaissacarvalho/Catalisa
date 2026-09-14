import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import SolutionModel from '@app/solutions/infrastructure/persistence/sequelize/models/solution.model';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';

export default class CommentModel extends Model {}

CommentModel.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'Comment',
    tableName: 'comments',
  },
);
