"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionMapper = void 0;
const solution_entity_1 = require("../../../../domain/entities/solution.entity");
class SolutionMapper {
    static toDomain(model) {
        return new solution_entity_1.SolutionEntity(model.id, model.userCode, model.challengeId, model.title, model.description, model.status, model.moderationReason, model.moderatedByUserCode, model.moderatedAt, model.createdAt, model.updatedAt);
    }
    static toDetails(model) {
        return {
            solution: this.toDomain(model),
            author: {
                userCode: model.author.userCode,
                name: model.author.name,
                jobPosition: model.author.jobPosition,
                enterprise: model.author.enterprise,
            },
            moderator: model.moderator
                ? {
                    userCode: model.moderator.userCode,
                    name: model.moderator.name,
                    role: model.moderator.role,
                }
                : null,
        };
    }
    static toPersistence(solution) {
        return {
            id: solution.id,
            userCode: solution.userCode,
            challengeId: solution.challengeId,
            title: solution.title,
            description: solution.description,
            status: solution.status,
            moderationReason: solution.moderationReason,
            moderatedByUserCode: solution.moderatedByUserCode,
            moderatedAt: solution.moderatedAt,
        };
    }
}
exports.SolutionMapper = SolutionMapper;
//# sourceMappingURL=solution.mapper.js.map