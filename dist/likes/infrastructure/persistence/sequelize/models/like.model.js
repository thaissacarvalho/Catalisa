"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../../../../database/sequelize");
class LikeModel extends sequelize_1.Model {
}
exports.default = LikeModel;
LikeModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    userCode: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
        references: {
            model: 'users',
            key: 'userCode',
        },
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('SOLUTION', 'COMMENT'),
        allowNull: false,
    },
    solutionId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'solutions',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    commentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'comments',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    sequelize: sequelize_2.sequelize,
    timestamps: true,
    modelName: 'Like',
    tableName: 'likes',
});
//# sourceMappingURL=like.model.js.map