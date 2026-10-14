"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCredentialEntity = void 0;
class AdminCredentialEntity {
    id;
    userId;
    passwordHash;
    mustChangePassword;
    passwordChangedAt;
    constructor(id, userId, passwordHash, mustChangePassword, passwordChangedAt) {
        this.id = id;
        this.userId = userId;
        this.passwordHash = passwordHash;
        this.mustChangePassword = mustChangePassword;
        this.passwordChangedAt = passwordChangedAt;
    }
}
exports.AdminCredentialEntity = AdminCredentialEntity;
//# sourceMappingURL=admin-credential.entity.js.map