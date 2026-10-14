"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../../../../database/sequelize");
const solution_status_enum_1 = require("../../../../domain/enums/solution-status.enum");
class SolutionModel extends sequelize_1.Model {
}
exports.default = SolutionModel;
SolutionModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    userCode: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    challengeId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(solution_status_enum_1.SolutionStatus)),
        allowNull: false,
        defaultValue: solution_status_enum_1.SolutionStatus.PUBLISHED,
    },
    moderationReason: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    moderatedByUserCode: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: true,
    },
    moderatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.sequelize,
    timestamps: true,
    modelName: 'Solution',
    tableName: 'solutions',
});
//# sourceMappingURL=solution.model.js.map