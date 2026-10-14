"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationRequestMapper = void 0;
const target_type_enum_1 = require("../../../../../common/domain/enums/target-type.enum");
const moderation_request_entity_1 = require("../../../../domain/entities/moderation-request.entity");
function toActor(model) {
    return {
        userCode: model.userCode,
        name: model.name,
        email: model.email,
    };
}
class ModerationRequestMapper {
    static toDomain(model) {
        const targetId = model.targetType === target_type_enum_1.TargetType.SOLUTION
            ? model.solutionId
            : model.commentId;
        if (!targetId) {
            throw new Error('Invalid persisted moderation target');
        }
        return new moderation_request_entity_1.ModerationRequestEntity(model.id, model.targetType, targetId, model.status, model.reason, model.requestedByUserCode, model.reviewedByUserCode, model.reviewReason, model.reviewedAt, model.createdAt, model.updatedAt);
    }
    static toDetails(model) {
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
    static toPersistence(request) {
        return {
            id: request.id,
            targetType: request.targetType,
            solutionId: request.targetType === target_type_enum_1.TargetType.SOLUTION ? request.targetId : null,
            commentId: request.targetType === target_type_enum_1.TargetType.COMMENT ? request.targetId : null,
            status: request.status,
            reason: request.reason,
            requestedByUserCode: request.requestedByUserCode,
            reviewedByUserCode: request.reviewedByUserCode,
            reviewReason: request.reviewReason,
            reviewedAt: request.reviewedAt,
        };
    }
}
exports.ModerationRequestMapper = ModerationRequestMapper;
//# sourceMappingURL=moderation-request.mapper.js.map