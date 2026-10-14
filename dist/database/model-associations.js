"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeModelAssociations = initializeModelAssociations;
const challenge_model_1 = __importDefault(require("../challenges/infrastructure/persistence/sequelize/models/challenge.model"));
const comment_model_1 = __importDefault(require("../comments/infrastructure/persistence/sequelize/models/comment.model"));
const like_model_1 = __importDefault(require("../likes/infrastructure/persistence/sequelize/models/like.model"));
const moderation_request_model_1 = __importDefault(require("../moderation/infrastructure/persistence/sequelize/models/moderation-request.model"));
const solution_model_1 = __importDefault(require("../solutions/infrastructure/persistence/sequelize/models/solution.model"));
const user_model_1 = __importDefault(require("../users/infrastructure/persistence/sequelize/models/user.model"));
let associationsInitialized = false;
function initializeModelAssociations() {
    if (associationsInitialized) {
        return;
    }
    solution_model_1.default.belongsTo(user_model_1.default, {
        as: 'author',
        foreignKey: 'userCode',
        targetKey: 'userCode',
    });
    user_model_1.default.hasMany(solution_model_1.default, {
        as: 'authoredSolutions',
        foreignKey: 'userCode',
        sourceKey: 'userCode',
    });
    solution_model_1.default.belongsTo(user_model_1.default, {
        as: 'moderator',
        foreignKey: 'moderatedByUserCode',
        targetKey: 'userCode',
    });
    user_model_1.default.hasMany(solution_model_1.default, {
        as: 'moderatedSolutions',
        foreignKey: 'moderatedByUserCode',
        sourceKey: 'userCode',
    });
    solution_model_1.default.belongsTo(challenge_model_1.default, {
        as: 'challenge',
        foreignKey: 'challengeId',
        targetKey: 'id',
    });
    challenge_model_1.default.hasMany(solution_model_1.default, {
        as: 'solutions',
        foreignKey: 'challengeId',
        sourceKey: 'id',
    });
    solution_model_1.default.hasMany(comment_model_1.default, {
        as: 'comments',
        foreignKey: 'solutionId',
        sourceKey: 'id',
    });
    comment_model_1.default.belongsTo(solution_model_1.default, {
        as: 'solution',
        foreignKey: 'solutionId',
        targetKey: 'id',
    });
    comment_model_1.default.belongsTo(comment_model_1.default, {
        as: 'parentComment',
        foreignKey: 'parentCommentId',
        targetKey: 'id',
    });
    comment_model_1.default.hasMany(comment_model_1.default, {
        as: 'replies',
        foreignKey: 'parentCommentId',
        sourceKey: 'id',
    });
    solution_model_1.default.hasMany(like_model_1.default, {
        as: 'likes',
        foreignKey: 'solutionId',
        sourceKey: 'id',
    });
    like_model_1.default.belongsTo(solution_model_1.default, {
        as: 'solution',
        foreignKey: 'solutionId',
        targetKey: 'id',
    });
    comment_model_1.default.belongsTo(user_model_1.default, {
        as: 'author',
        foreignKey: 'userCode',
        targetKey: 'userCode',
    });
    user_model_1.default.hasMany(comment_model_1.default, {
        as: 'comments',
        foreignKey: 'userCode',
        sourceKey: 'userCode',
    });
    comment_model_1.default.belongsTo(user_model_1.default, {
        as: 'moderator',
        foreignKey: 'moderatedByUserCode',
        targetKey: 'userCode',
    });
    like_model_1.default.belongsTo(user_model_1.default, {
        as: 'user',
        foreignKey: 'userCode',
        targetKey: 'userCode',
    });
    user_model_1.default.hasMany(like_model_1.default, {
        as: 'likes',
        foreignKey: 'userCode',
        sourceKey: 'userCode',
    });
    like_model_1.default.belongsTo(comment_model_1.default, {
        as: 'comment',
        foreignKey: 'commentId',
        targetKey: 'id',
    });
    comment_model_1.default.hasMany(like_model_1.default, {
        as: 'likes',
        foreignKey: 'commentId',
        sourceKey: 'id',
    });
    moderation_request_model_1.default.belongsTo(user_model_1.default, {
        as: 'requestedBy',
        foreignKey: 'requestedByUserCode',
        targetKey: 'userCode',
    });
    user_model_1.default.hasMany(moderation_request_model_1.default, {
        as: 'requestedModerations',
        foreignKey: 'requestedByUserCode',
        sourceKey: 'userCode',
    });
    moderation_request_model_1.default.belongsTo(user_model_1.default, {
        as: 'reviewedBy',
        foreignKey: 'reviewedByUserCode',
        targetKey: 'userCode',
    });
    user_model_1.default.hasMany(moderation_request_model_1.default, {
        as: 'reviewedModerations',
        foreignKey: 'reviewedByUserCode',
        sourceKey: 'userCode',
    });
    associationsInitialized = true;
}
//# sourceMappingURL=model-associations.js.map