"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLikeTargetFromDto = toLikeTargetFromDto;
const target_type_enum_1 = require("../../../common/domain/enums/target-type.enum");
function toLikeTargetFromDto(data) {
    return data.type === target_type_enum_1.TargetType.SOLUTION
        ? {
            type: target_type_enum_1.TargetType.SOLUTION,
            solutionId: data.targetId,
        }
        : {
            type: target_type_enum_1.TargetType.COMMENT,
            commentId: data.targetId,
        };
}
//# sourceMappingURL=to-like-target-from-dto.helper.js.map