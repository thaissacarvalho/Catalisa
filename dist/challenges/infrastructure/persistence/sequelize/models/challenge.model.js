"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../../../../database/sequelize");
const ChallengeStatus_enum_1 = require("../../../../domain/enums/ChallengeStatus.enum");
class ChallengeModel extends sequelize_1.Model {
}
exports.default = ChallengeModel;
ChallengeModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    code: {
        type: sequelize_1.DataTypes.STRING(60),
        allowNull: false,
        unique: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(120),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: ChallengeStatus_enum_1.ChallengeStatus.ACTIVE,
    },
    displayOrder: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        unique: true,
        validate: { min: 1 },
    },
}, {
    sequelize: sequelize_2.sequelize,
    timestamps: true,
    modelName: 'Challenge',
    tableName: 'challenges',
    indexes: [
        {
            name: 'challenges_status_display_order_index',
            fields: ['status', 'displayOrder'],
        },
    ],
});
//# sourceMappingURL=challenge.model.js.map