"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLikeTarget = toLikeTarget;
const target_type_enum_1 = require("../../../../../common/domain/enums/target-type.enum");
function toLikeTarget(data) {
    switch (data.type) {
        case target_type_enum_1.TargetType.SOLUTION:
            if (data.solutionId == null || data.commentId != null) {
                throw new Error('Invalid persisted solution like');
            }
            return {
                type: target_type_enum_1.TargetType.SOLUTION,
                solutionId: data.solutionId,
            };
        case target_type_enum_1.TargetType.COMMENT:
            if (data.commentId == null || data.solutionId != null) {
                throw new Error('Invalid persisted comment like');
            }
            return {
                type: target_type_enum_1.TargetType.COMMENT,
                commentId: data.commentId,
            };
        default:
            throw new Error('Invalid persisted like type');
    }
}
//# sourceMappingURL=like-target.mapper.js.map