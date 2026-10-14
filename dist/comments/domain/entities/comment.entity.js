"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentEntity = void 0;
class CommentEntity {
    id;
    solutionId;
    parentCommentId;
    userCode;
    comment;
    status;
    moderationReason;
    moderatedByUserCode;
    moderatedAt;
    createdAt;
    updatedAt;
    author;
    constructor(id, solutionId, parentCommentId, userCode, comment, status, moderationReason = null, moderatedByUserCode = null, moderatedAt = null, createdAt = null, updatedAt = null, author = null) {
        this.id = id;
        this.solutionId = solutionId;
        this.parentCommentId = parentCommentId;
        this.userCode = userCode;
        this.comment = comment;
        this.status = status;
        this.moderationReason = moderationReason;
        this.moderatedByUserCode = moderatedByUserCode;
        this.moderatedAt = moderatedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.author = author;
    }
}
exports.CommentEntity = CommentEntity;
//# sourceMappingURL=comment.entity.js.map