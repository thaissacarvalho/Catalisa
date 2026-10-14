"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetWhere = targetWhere;
const target_type_enum_1 = require("../../../../../common/domain/enums/target-type.enum");
function targetWhere(target) {
    return target.type === target_type_enum_1.TargetType.SOLUTION
        ? {
            type: target.type,
            solutionId: target.solutionId,
        }
        : {
            type: target.type,
            commentId: target.commentId,
        };
}
//# sourceMappingURL=like-target-where.helper.js.map