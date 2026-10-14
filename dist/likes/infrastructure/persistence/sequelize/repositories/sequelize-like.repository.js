"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeLikeRepository = void 0;
const sequelize_1 = require("sequelize");
const app_http_exception_1 = require("../../../../../common/http/app-http.exception");
const token_codes_1 = require("../../../../../common/http/token-codes");
const like_model_1 = __importDefault(require("../models/like.model"));
const like_mapper_1 = require("../mappers/like.mapper");
const like_target_where_helper_1 = require("../helpers/like-target-where.helper");
const visible_like_includes_helper_1 = require("../helpers/visible-like-includes.helper");
class SequelizeLikeRepository {
    async createLike(like) {
        try {
            const model = await like_model_1.default.create(like_mapper_1.LikeMapper.toPersistence(like));
            return like_mapper_1.LikeMapper.toDomain(model);
        }
        catch (error) {
            if (error instanceof sequelize_1.UniqueConstraintError) {
                const constraint = error.parent
                    .constraint;
                if (constraint === 'likes_solution_user_unique' ||
                    constraint === 'likes_comment_user_unique') {
                    throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.LIKE_ALREADY_EXISTS);
                }
            }
            throw error;
        }
    }
    async findByUserAndTarget(userCode, target) {
        const model = await like_model_1.default.findOne({
            where: {
                userCode,
                ...(0, like_target_where_helper_1.targetWhere)(target),
            },
        });
        return model ? like_mapper_1.LikeMapper.toDomain(model) : null;
    }
    async deleteByUserAndTarget(userCode, target) {
        const deleted = await like_model_1.default.destroy({
            where: {
                userCode,
                ...(0, like_target_where_helper_1.targetWhere)(target),
            },
        });
        return deleted > 0;
    }
    async countBy(target) {
        return like_model_1.default.count({
            where: (0, like_target_where_helper_1.targetWhere)(target),
            include: (0, visible_like_includes_helper_1.visibleLikeIncludes)(target),
            distinct: true,
            col: 'id',
        });
    }
}
exports.SequelizeLikeRepository = SequelizeLikeRepository;
//# sourceMappingURL=sequelize-like.repository.js.map