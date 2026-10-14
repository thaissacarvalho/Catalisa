"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionEntity = void 0;
class SolutionEntity {
    id;
    userCode;
    challengeId;
    title;
    description;
    status;
    moderationReason;
    moderatedByUserCode;
    moderatedAt;
    createdAt;
    updatedAt;
    constructor(id, userCode, challengeId, title, description, status, moderationReason, moderatedByUserCode, moderatedAt, createdAt = null, updatedAt = null) {
        this.id = id;
        this.userCode = userCode;
        this.challengeId = challengeId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.moderationReason = moderationReason;
        this.moderatedByUserCode = moderatedByUserCode;
        this.moderatedAt = moderatedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.SolutionEntity = SolutionEntity;
//# sourceMappingURL=solution.entity.js.map