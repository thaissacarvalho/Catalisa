"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visibleLikeIncludes = visibleLikeIncludes;
const target_type_enum_1 = require("../../../../../common/domain/enums/target-type.enum");
const comment_status_enum_1 = require("../../../../../comments/domain/enums/comment-status.enum");
const solution_status_enum_1 = require("../../../../../solutions/domain/enums/solution-status.enum");
const user_status_enum_1 = require("../../../../../users/domain/enums/user-status.enum");
function activeUser(association) {
    return {
        association,
        attributes: [],
        required: true,
        where: { status: user_status_enum_1.UserStatus.ACTIVE },
    };
}
function visibleSolution() {
    return {
        association: 'solution',
        attributes: [],
        required: true,
        where: { status: solution_status_enum_1.SolutionStatus.PUBLISHED },
        include: [activeUser('author')],
    };
}
function visibleLikeIncludes(target) {
    // Usuário que realizou a curtida.
    const user = activeUser('user');
    if (target.type === target_type_enum_1.TargetType.SOLUTION) {
        return [user, visibleSolution()];
    }
    return [
        user,
        {
            association: 'comment',
            attributes: [],
            required: true,
            where: { status: comment_status_enum_1.CommentStatus.ACTIVE },
            include: [activeUser('author'), visibleSolution()],
        },
    ];
}
//# sourceMappingURL=visible-like-includes.helper.js.map