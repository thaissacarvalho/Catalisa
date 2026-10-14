"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderationTargetWhere = moderationTargetWhere;
exports.ensureModerationTargetCanBeRemoved = ensureModerationTargetCanBeRemoved;
exports.removeModerationTarget = removeModerationTarget;
const comment_status_enum_1 = require("../../../../../comments/domain/enums/comment-status.enum");
const comment_model_1 = __importDefault(require("../../../../../comments/infrastructure/persistence/sequelize/models/comment.model"));
const target_type_enum_1 = require("../../../../../common/domain/enums/target-type.enum");
const app_http_exception_1 = require("../../../../../common/http/app-http.exception");
const token_codes_1 = require("../../../../../common/http/token-codes");
const solution_status_enum_1 = require("../../../../../solutions/domain/enums/solution-status.enum");
const solution_model_1 = __importDefault(require("../../../../../solutions/infrastructure/persistence/sequelize/models/solution.model"));
function moderationTargetWhere(targetType, targetId) {
    return targetType === target_type_enum_1.TargetType.SOLUTION
        ? { solutionId: targetId }
        : { commentId: targetId };
}
async function ensureModerationTargetCanBeRemoved(targetType, targetId, transaction) {
    if (targetType === target_type_enum_1.TargetType.SOLUTION) {
        const solution = await solution_model_1.default.findByPk(targetId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!solution) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_NOT_FOUND);
        }
        if (solution.status === solution_status_enum_1.SolutionStatus.REMOVED) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.MODERATION_TARGET_ALREADY_REMOVED);
        }
        return;
    }
    const comment = await comment_model_1.default.findByPk(targetId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
    if (!comment) {
        throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.COMMENT_NOT_FOUND);
    }
    if (comment.status === comment_status_enum_1.CommentStatus.EXCLUDED) {
        throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.MODERATION_TARGET_ALREADY_REMOVED);
    }
}
async function removeModerationTarget(target, reviewerUserCode, transaction) {
    if (target.targetType === target_type_enum_1.TargetType.SOLUTION) {
        if (!target.solutionId) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_PERSISTENCE_DATA);
        }
        const solution = await solution_model_1.default.findByPk(target.solutionId, {
            transaction,
            lock: transaction.LOCK.UPDATE,
        });
        if (!solution) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_NOT_FOUND);
        }
        if (solution.status === solution_status_enum_1.SolutionStatus.REMOVED) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.MODERATION_TARGET_ALREADY_REMOVED);
        }
        solution.status = solution_status_enum_1.SolutionStatus.REMOVED;
        solution.moderationReason = target.reason;
        solution.moderatedByUserCode = reviewerUserCode;
        solution.moderatedAt = new Date();
        await solution.save({ transaction });
        return;
    }
    if (!target.commentId) {
        throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_PERSISTENCE_DATA);
    }
    const comment = await comment_model_1.default.findByPk(target.commentId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
    });
    if (!comment) {
        throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.COMMENT_NOT_FOUND);
    }
    if (comment.status === comment_status_enum_1.CommentStatus.EXCLUDED) {
        throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.MODERATION_TARGET_ALREADY_REMOVED);
    }
    comment.status = comment_status_enum_1.CommentStatus.EXCLUDED;
    comment.moderationReason = target.reason;
    comment.moderatedByUserCode = reviewerUserCode;
    comment.moderatedAt = new Date();
    await comment.save({ transaction });
}
//# sourceMappingURL=moderation-target.helper.js.map