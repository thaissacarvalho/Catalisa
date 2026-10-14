"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../../../../database/sequelize");
const user_role_enum_1 = require("../../../../domain/enums/user-role.enum");
const user_status_enum_1 = require("../../../../domain/enums/user-status.enum");
class UserModel extends sequelize_1.Model {
}
exports.default = UserModel;
UserModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(120),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(320),
        allowNull: false,
        unique: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED', 'SUSPENDED'),
        allowNull: false,
        defaultValue: user_status_enum_1.UserStatus.ACTIVE,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('PARTICIPANT', 'ADMIN', 'SUPER_ADMIN'),
        allowNull: false,
        defaultValue: user_role_enum_1.UserRole.PARTICIPANT,
    },
    jobPosition: {
        type: sequelize_1.DataTypes.STRING(80),
        allowNull: false,
    },
    enterprise: {
        type: sequelize_1.DataTypes.STRING(120),
        allowNull: false,
    },
    userCode: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
        unique: true,
    },
}, {
    sequelize: sequelize_2.sequelize,
    timestamps: true,
    modelName: 'User',
    tableName: 'users',
});
//# sourceMappingURL=user.model.js.map