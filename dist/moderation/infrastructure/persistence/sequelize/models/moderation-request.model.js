"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../../../../database/sequelize");
const moderation_request_status_enum_1 = require("../../../../domain/enums/moderation-request-status.enum");
const target_type_enum_1 = require("../../../../../common/domain/enums/target-type.enum");
class ModerationRequestModel extends sequelize_1.Model {
}
exports.default = ModerationRequestModel;
ModerationRequestModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    targetType: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(target_type_enum_1.TargetType)),
        allowNull: false,
    },
    solutionId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: { model: 'solutions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    commentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: { model: 'comments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(moderation_request_status_enum_1.ModerationRequestStatus)),
        allowNull: false,
        defaultValue: moderation_request_status_enum_1.ModerationRequestStatus.PENDING,
    },
    reason: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
    },
    requestedByUserCode: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
        references: { model: 'users', key: 'userCode' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    reviewedByUserCode: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: true,
        references: { model: 'users', key: 'userCode' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    reviewReason: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    reviewedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.sequelize,
    timestamps: true,
    modelName: 'ModerationRequest',
    tableName: 'moderation_requests',
});
//# sourceMappingURL=moderation-request.model.js.map