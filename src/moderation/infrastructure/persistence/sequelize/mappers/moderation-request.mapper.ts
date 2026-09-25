import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { ModerationRequestDetails } from '@app/moderation/domain/entities/moderation-request-details.entity';
import { ModerationRequestEntity } from '@app/moderation/domain/entities/moderation-request.entity';
import ModerationRequestModel from '@app/moderation/infrastructure/persistence/sequelize/models/moderation-request.model';
import UserModel from '@app/users/infrastructure/persistence/sequelize/models/user.model';

function toActor(model: UserModel) {
  return {
    userCode: model.userCode,
    name: model.name,
    email: model.email,
  };
}

export class ModerationRequestMapper {
  static toDomain(model: ModerationRequestModel): ModerationRequestEntity {
    const targetId =
      model.targetType === TargetType.SOLUTION
        ? model.solutionId
        : model.commentId;

    if (!targetId) {
      throw new Error('Invalid persisted moderation target');
    }

    return new ModerationRequestEntity(
      model.id,
      model.targetType,
      targetId,
      model.status,
      model.reason,
      model.requestedByUserCode,
      model.reviewedByUserCode,
      model.reviewReason,
      model.reviewedAt,
      model.createdAt,
      model.updatedAt,
    );
  }

  static toDetails(model: ModerationRequestModel): ModerationRequestDetails {
    if (!model.requestedBy) {
      throw new Error('Moderation requester was not loaded');
    }

    if (model.reviewedByUserCode && !model.reviewedBy) {
      throw new Error('Moderation reviewer was not loaded');
    }

    return {
      request: ModerationRequestMapper.toDomain(model),
      requestedBy: toActor(model.requestedBy),
      reviewedBy: model.reviewedBy ? toActor(model.reviewedBy) : null,
    };
  }

  static toPersistence(request: ModerationRequestEntity) {
    return {
      id: request.id,
      targetType: request.targetType,
      solutionId:
        request.targetType === TargetType.SOLUTION ? request.targetId : null,
      commentId:
        request.targetType === TargetType.COMMENT ? request.targetId : null,
      status: request.status,
      reason: request.reason,
      requestedByUserCode: request.requestedByUserCode,
      reviewedByUserCode: request.reviewedByUserCode,
      reviewReason: request.reviewReason,
      reviewedAt: request.reviewedAt,
    };
  }
}
