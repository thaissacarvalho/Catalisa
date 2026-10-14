"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeAdminCredentialRepository = void 0;
const admin_credential_entity_1 = require("../../../../domain/entities/admin-credential.entity");
const sequelize_1 = require("../../../../../../database/sequelize");
const user_model_1 = __importDefault(require("../../../../../../users/infrastructure/persistence/sequelize/models/user.model"));
const user_role_enum_1 = require("../../../../../../users/domain/enums/user-role.enum");
const admin_credential_model_1 = __importDefault(require("../models/admin-credential.model"));
const node_crypto_1 = require("node:crypto");
class SequelizeAdminCredentialRepository {
    async findByUserId(userId) {
        const credential = await admin_credential_model_1.default.findOne({
            where: { userId },
        });
        return credential ? this.toDomain(credential) : null;
    }
    async promoteParticipantToAdmin(userId, passwordHash) {
        return sequelize_1.sequelize.transaction(async (transaction) => {
            const [updatedUsers] = await user_model_1.default.update({ role: user_role_enum_1.UserRole.ADMIN }, {
                where: { id: userId, role: user_role_enum_1.UserRole.PARTICIPANT },
                transaction,
            });
            if (updatedUsers === 0) {
                return null;
            }
            const credential = await admin_credential_model_1.default.create({
                id: (0, node_crypto_1.randomUUID)(),
                userId,
                passwordHash,
                mustChangePassword: true,
                passwordChangedAt: null,
            }, { transaction });
            return this.toDomain(credential);
        });
    }
    async updatePassword(userId, passwordHash) {
        return sequelize_1.sequelize.transaction(async (transaction) => {
            const credential = await admin_credential_model_1.default.findOne({
                where: { userId },
                transaction,
            });
            if (!credential) {
                return null;
            }
            credential.passwordHash = passwordHash;
            credential.mustChangePassword = false;
            credential.passwordChangedAt = new Date();
            await credential.save({ transaction });
            return this.toDomain(credential);
        });
    }
    toDomain(model) {
        return new admin_credential_entity_1.AdminCredentialEntity(model.id, model.userId, model.passwordHash, model.mustChangePassword, model.passwordChangedAt);
    }
    async createInitialSuperAdmin(user, passwordHash) {
        return sequelize_1.sequelize.transaction(async (transaction) => {
            await user_model_1.default.create({
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
                role: user.role,
                jobPosition: user.jobPosition,
                enterprise: user.enterprise,
                userCode: user.userCode,
            }, { transaction });
            const credential = await admin_credential_model_1.default.create({
                id: (0, node_crypto_1.randomUUID)(),
                userId: user.id,
                passwordHash,
                mustChangePassword: true,
                passwordChangedAt: null,
            }, { transaction });
            return this.toDomain(credential);
        });
    }
}
exports.SequelizeAdminCredentialRepository = SequelizeAdminCredentialRepository;
//# sourceMappingURL=sequelize-admin-credential.repository.js.map