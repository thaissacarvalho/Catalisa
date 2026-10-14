"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    id;
    name;
    email;
    status;
    role;
    jobPosition;
    enterprise;
    userCode;
    constructor(id, name, email, status, role, jobPosition, enterprise, userCode) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.status = status;
        this.role = role;
        this.jobPosition = jobPosition;
        this.enterprise = enterprise;
        this.userCode = userCode;
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map