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
  declare author?: UserModel;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CommentModel.init(
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
    comment: {
      type: DataTypes.STRING(280),
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
