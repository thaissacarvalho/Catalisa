"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../../../../database/sequelize");
const solution_model_1 = __importDefault(require("../../../../../solutions/infrastructure/persistence/sequelize/models/solution.model"));
const user_model_1 = __importDefault(require("../../../../../users/infrastructure/persistence/sequelize/models/user.model"));
const comment_status_enum_1 = require("../../../../domain/enums/comment-status.enum");
class CommentModel extends sequelize_1.Model {
}
exports.default = CommentModel;
CommentModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    solutionId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: solution_model_1.default,
            key: 'id',
        },
    },
    parentCommentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'comments',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    userCode: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
        references: {
            model: user_model_1.default,
            key: 'userCode',
        },
    },
    comment: {
        type: sequelize_1.DataTypes.STRING(280),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('ACTIVE', 'INACTIVE', 'EXCLUDED'),
        allowNull: false,
        defaultValue: comment_status_enum_1.CommentStatus.ACTIVE,
    },
    moderationReason: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    moderatedByUserCode: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: true,
        references: {
            model: 'users',
            key: 'userCode',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    moderatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.sequelize,
    timestamps: true,
    modelName: 'Comment',
    tableName: 'comments',
});
//# sourceMappingURL=comment.model.js.map