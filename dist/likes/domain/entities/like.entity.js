"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeEntity = void 0;
class LikeEntity {
    id;
    userCode;
    target;
    createdAt;
    updatedAt;
    constructor(id, userCode, target, createdAt = null, updatedAt = null) {
        this.id = id;
        this.userCode = userCode;
        this.target = target;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.LikeEntity = LikeEntity;
//# sourceMappingURL=like.entity.js.map