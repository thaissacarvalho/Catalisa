import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@app/database/sequelize';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';

export default class ModerationRequestModel extends Model {
  declare id: string;
  declare targetType: TargetType;
  declare solutionId: string | null;
  declare commentId: string | null;
  declare status: ModerationRequestStatus;
  declare reason: string;
  declare requestedByUserCode: string;
  declare reviewedByUserCode: string | null;
  declare reviewReason: string | null;
  declare requestedBy?: UserModel;
  declare reviewedBy?: UserModel;
  declare reviewedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ModerationRequestModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    targetType: {
      type: DataTypes.ENUM(...Object.values(TargetType)),
      allowNull: false,
    },
    solutionId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'solutions', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    commentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'comments', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ModerationRequestStatus)),
      allowNull: false,
      defaultValue: ModerationRequestStatus.PENDING,
    },
    reason: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    requestedByUserCode: {
      type: DataTypes.STRING(40),
      allowNull: false,
      references: { model: 'users', key: 'userCode' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    reviewedByUserCode: {
      type: DataTypes.STRING(40),
      allowNull: true,
      references: { model: 'users', key: 'userCode' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    reviewReason: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'ModerationRequest',
    tableName: 'moderation_requests',
  },
);
