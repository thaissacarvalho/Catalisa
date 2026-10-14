"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeMapper = void 0;
const challenge_entity_1 = require("../../../../domain/entities/challenge.entity");
class ChallengeMapper {
    static toDomain(model) {
        return new challenge_entity_1.ChallengeEntity(model.id, model.code, model.title, model.description, model.status, model.displayOrder, model.createdAt, model.updatedAt);
    }
    static toPersistence(challenge) {
        return {
            code: challenge.code,
            title: challenge.title,
            description: challenge.description,
            status: challenge.status,
            displayOrder: challenge.displayOrder,
            createdAt: challenge.createdAt,
            updatedAt: challenge.updatedAt,
        };
    }
}
exports.ChallengeMapper = ChallengeMapper;
//# sourceMappingURL=challenge.mapper.js.map