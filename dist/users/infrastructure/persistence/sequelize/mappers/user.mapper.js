"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_entity_1 = require("../../../../domain/entities/user.entity");
class UserMapper {
    static toDomain(model) {
        return new user_entity_1.UserEntity(model.id, model.name, model.email, model.status, model.role, model.jobPosition, model.enterprise, model.userCode);
    }
    static toPersistence(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            role: user.role,
            jobPosition: user.jobPosition,
            enterprise: user.enterprise,
            userCode: user.userCode,
        };
    }
}
exports.UserMapper = UserMapper;
//# sourceMappingURL=user.mapper.js.map