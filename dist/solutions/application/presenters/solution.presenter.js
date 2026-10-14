"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionPresenter = void 0;
const solution_status_enum_1 = require("../../domain/enums/solution-status.enum");
class SolutionPresenter {
    static created(solution) {
        return {
            id: solution.id,
            userCode: solution.userCode,
            challengeId: solution.challengeId,
            title: solution.title,
            description: solution.description,
            status: solution.status,
            createdAt: solution.createdAt,
        };
    }
    static public(details) {
        const { solution, author } = details;
        return {
            id: solution.id,
            challengeId: solution.challengeId,
            title: solution.title,
            description: solution.description,
            status: solution.status,
            createdAt: solution.createdAt,
            author,
        };
    }
    static admin(details) {
        const { solution, author, moderator } = details;
        return {
            id: solution.id,
            challengeId: solution.challengeId,
            title: solution.title,
            description: solution.description,
            status: solution.status,
            createdAt: solution.createdAt,
            updatedAt: solution.updatedAt,
            author,
            moderation: solution.status === solution_status_enum_1.SolutionStatus.REMOVED
                ? {
                    reason: solution.moderationReason,
                    moderatedAt: solution.moderatedAt,
                    moderator,
                }
                : null,
        };
    }
    static statusUpdated(solution) {
        return {
            id: solution.id,
            status: solution.status,
            moderation: solution.status === solution_status_enum_1.SolutionStatus.REMOVED
                ? {
                    reason: solution.moderationReason,
                    moderatedAt: solution.moderatedAt,
                    moderatedByUserCode: solution.moderatedByUserCode,
                }
                : null,
        };
    }
}
exports.SolutionPresenter = SolutionPresenter;
//# sourceMappingURL=solution.presenter.js.map