import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import { LikeType } from '@app/likes/domain/enums/like-type.enum';

export default class LikeModel extends Model {
  declare id: string;
  declare userCode: string;
  declare type: LikeType;
  declare solutionId: string | null;
  declare commentId: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

LikeModel.init(
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
      references: {
        model: 'users',
        key: 'userCode',
      },
    },
    type: {
      type: DataTypes.ENUM('SOLUTION', 'COMMENT'),
      allowNull: false,
    },
    solutionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'solutions',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    commentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'Like',
    tableName: 'likes',
  },
);
