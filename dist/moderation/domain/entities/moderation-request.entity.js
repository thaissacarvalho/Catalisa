"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationRequestEntity = void 0;
class ModerationRequestEntity {
    id;
    targetType;
    targetId;
    status;
    reason;
    requestedByUserCode;
    reviewedByUserCode;
    reviewReason;
    reviewedAt;
    createdAt;
    updatedAt;
    constructor(id, targetType, targetId, status, reason, requestedByUserCode, reviewedByUserCode, reviewReason, reviewedAt, createdAt, updatedAt) {
        this.id = id;
        this.targetType = targetType;
        this.targetId = targetId;
        this.status = status;
        this.reason = reason;
        this.requestedByUserCode = requestedByUserCode;
        this.reviewedByUserCode = reviewedByUserCode;
        this.reviewReason = reviewReason;
        this.reviewedAt = reviewedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.ModerationRequestEntity = ModerationRequestEntity;
//# sourceMappingURL=moderation-request.entity.js.map