"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeEntity = void 0;
class ChallengeEntity {
    id;
    code;
    title;
    description;
    status;
    displayOrder;
    createdAt;
    updatedAt;
    constructor(id, code, title, description, status, displayOrder, createdAt, updatedAt) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.description = description;
        this.status = status;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.ChallengeEntity = ChallengeEntity;
//# sourceMappingURL=challenge.entity.js.map