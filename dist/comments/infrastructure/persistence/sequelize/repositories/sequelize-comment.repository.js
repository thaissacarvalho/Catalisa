"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeCommentRepository = void 0;
const sequelize_1 = require("../../../../../database/sequelize");
const solution_status_enum_1 = require("../../../../../solutions/domain/enums/solution-status.enum");
const app_http_exception_1 = require("../../../../../common/http/app-http.exception");
const token_codes_1 = require("../../../../../common/http/token-codes");
const comment_status_enum_1 = require("../../../../domain/enums/comment-status.enum");
const comment_model_1 = __importDefault(require("../models/comment.model"));
const comment_mapper_1 = require("../mappers/comment.mapper");
const user_status_enum_1 = require("../../../../../users/domain/enums/user-status.enum");
const authorInclude = {
    association: 'author',
    attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
    required: true,
    where: { status: user_status_enum_1.UserStatus.ACTIVE },
};
const visibleSolutionInclude = {
    association: 'solution',
    attributes: [],
    required: true,
    where: { status: solution_status_enum_1.SolutionStatus.PUBLISHED },
    include: [
        {
            association: 'author',
            attributes: [],
            required: true,
            where: { status: user_status_enum_1.UserStatus.ACTIVE },
        },
    ],
};
class SequelizeCommentRepository {
    async create(comment) {
        const model = await comment_model_1.default.create(comment_mapper_1.CommentMapper.toPersistence(comment));
        await model.reload({
            include: [
                {
                    association: 'author',
                    attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
                },
            ],
        });
        return comment_mapper_1.CommentMapper.toDomain(model);
    }
    async find(id) {
        const comment = await comment_model_1.default.findOne({
            where: { id, status: comment_status_enum_1.CommentStatus.ACTIVE },
            include: [authorInclude, visibleSolutionInclude],
        });
        if (!comment ||
            !(await this.ancestorsAreVisible(comment.parentCommentId))) {
            return null;
        }
        return comment_mapper_1.CommentMapper.toDomain(comment);
    }
    async findById(id) {
        const comment = await comment_model_1.default.findByPk(id, {
            include: [
                {
                    association: 'author',
                    attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
                },
            ],
        });
        return comment ? comment_mapper_1.CommentMapper.toDomain(comment) : null;
    }
    async findCommentBySolution(solutionId) {
        const comments = await comment_model_1.default.findAll({
            where: {
                solutionId,
                status: comment_status_enum_1.CommentStatus.ACTIVE,
            },
            include: [authorInclude, visibleSolutionInclude],
            order: [
                ['createdAt', 'ASC'],
                ['id', 'ASC'],
            ],
        });
        const visibleIds = new Set();
        let changed = true;
        while (changed) {
            changed = false;
            for (const comment of comments) {
                if (visibleIds.has(comment.id)) {
                    continue;
                }
                if (comment.parentCommentId === null ||
                    visibleIds.has(comment.parentCommentId)) {
                    visibleIds.add(comment.id);
                    changed = true;
                }
            }
        }
        return comments
            .filter((comment) => visibleIds.has(comment.id))
            .map(comment_mapper_1.CommentMapper.toDomain);
    }
    async ancestorsAreVisible(parentCommentId) {
        const visited = new Set();
        let currentId = parentCommentId;
        while (currentId) {
            if (visited.has(currentId))
                return false;
            visited.add(currentId);
            const parent = await comment_model_1.default.findOne({
                where: { id: currentId, status: comment_status_enum_1.CommentStatus.ACTIVE },
                include: [authorInclude, visibleSolutionInclude],
            });
            if (!parent)
                return false;
            currentId = parent.parentCommentId;
        }
        return true;
    }
    async updateStatus(id, status, moderatedByUserCode, moderationReason) {
        return sequelize_1.sequelize.transaction(async (transaction) => {
            const comment = await comment_model_1.default.findByPk(id, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!comment)
                return null;
            if (comment.status === status ||
                comment.status === comment_status_enum_1.CommentStatus.EXCLUDED) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.CONFLICT);
            }
            comment.status = status;
            comment.moderationReason =
                status === comment_status_enum_1.CommentStatus.EXCLUDED
                    ? (moderationReason?.trim() ?? null)
                    : null;
            comment.moderatedByUserCode =
                status === comment_status_enum_1.CommentStatus.EXCLUDED
                    ? (moderatedByUserCode ?? null)
                    : null;
            comment.moderatedAt =
                status === comment_status_enum_1.CommentStatus.EXCLUDED ? new Date() : null;
            await comment.save({ transaction });
            await comment.reload({
                transaction,
                include: [
                    {
                        association: 'author',
                        attributes: ['userCode', 'name', 'jobPosition', 'enterprise'],
                    },
                ],
            });
            return comment_mapper_1.CommentMapper.toDomain(comment);
        });
    }
}
exports.SequelizeCommentRepository = SequelizeCommentRepository;
//# sourceMappingURL=sequelize-comment.repository.js.map