import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import SolutionModel from '@app/solutions/infrastructure/persistence/sequelize/models/solution.model';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';

export default class CommentModel extends Model {
  declare id: string;
  declare solutionId: string;
  declare userCode: string;
  declare comment: string;
  declare status: CommentStatus;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

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
    userCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'usersCode',
      },
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'EXCLUDED'),
      allowNull: false,
      defaultValue: CommentStatus.ACTIVE,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'Comment',
    tableName: 'comments',
  },
);
