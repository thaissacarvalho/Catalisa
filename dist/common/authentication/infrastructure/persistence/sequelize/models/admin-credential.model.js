"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../../../../../database/sequelize");
class AdminCredentialModel extends sequelize_1.Model {
}
exports.default = AdminCredentialModel;
AdminCredentialModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: 'user_id',
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash',
    },
    mustChangePassword: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'must_change_password',
    },
    passwordChangedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'password_changed_at',
    },
}, {
    sequelize: sequelize_2.sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'AdminCredential',
    tableName: 'admin_credentials',
});
//# sourceMappingURL=admin-credential.model.js.map