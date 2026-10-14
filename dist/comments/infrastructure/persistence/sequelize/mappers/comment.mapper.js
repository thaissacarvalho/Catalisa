"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentMapper = void 0;
class CommentMapper {
    static toDomain(model) {
        return {
            id: model.id,
            solutionId: model.solutionId,
            parentCommentId: model.parentCommentId,
            userCode: model.userCode,
            comment: model.comment,
            status: model.status,
            moderationReason: model.moderationReason,
            moderatedByUserCode: model.moderatedByUserCode,
            moderatedAt: model.moderatedAt,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            author: model.author
                ? {
                    userCode: model.author.userCode,
                    name: model.author.name,
                    jobPosition: model.author.jobPosition,
                    enterprise: model.author.enterprise,
                }
                : null,
        };
    }
    static toPersistence(comment) {
        return {
            id: comment.id,
            solutionId: comment.solutionId,
            parentCommentId: comment.parentCommentId,
            userCode: comment.userCode,
            comment: comment.comment,
            status: comment.status,
            moderationReason: comment.moderationReason,
            moderatedByUserCode: comment.moderatedByUserCode,
            moderatedAt: comment.moderatedAt,
        };
    }
}
exports.CommentMapper = CommentMapper;
//# sourceMappingURL=comment.mapper.js.map