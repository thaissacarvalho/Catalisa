"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeMapper = void 0;
const like_entity_1 = require("../../../../domain/entities/like.entity");
const target_type_enum_1 = require("../../../../../common/domain/enums/target-type.enum");
const like_target_mapper_1 = require("./like-target.mapper");
class LikeMapper {
    static toDomain(model) {
        return new like_entity_1.LikeEntity(model.id, model.userCode, (0, like_target_mapper_1.toLikeTarget)(model), model.createdAt, model.updatedAt);
    }
    static toPersistence(like) {
        return {
            id: like.id,
            userCode: like.userCode,
            type: like.target.type,
            solutionId: like.target.type === target_type_enum_1.TargetType.SOLUTION
                ? like.target.solutionId
                : null,
            commentId: like.target.type === target_type_enum_1.TargetType.COMMENT ? like.target.commentId : null,
        };
    }
}
exports.LikeMapper = LikeMapper;
//# sourceMappingURL=like.mapper.js.map