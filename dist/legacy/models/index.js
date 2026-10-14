"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const challenge_model_1 = __importDefault(require("../../challenges/infrastructure/persistence/sequelize/models/challenge.model"));
const comment_model_1 = __importDefault(require("../../comments/infrastructure/persistence/sequelize/models/comment.model"));
const sequelizeCli_1 = __importDefault(require("../../config/sequelizeCli"));
const like_model_1 = __importDefault(require("../../likes/infrastructure/persistence/sequelize/models/like.model"));
const solution_model_1 = __importDefault(require("../../solutions/infrastructure/persistence/sequelize/models/solution.model"));
const user_model_1 = __importDefault(require("../../users/infrastructure/persistence/sequelize/models/user.model"));
const currentEnvironment = process.env.NODE_ENV || 'development';
const databaseConfig = sequelizeCli_1.default[currentEnvironment];
const sequelize = new sequelize_1.Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
});
exports.default = {
    sequelize,
    Solutions: solution_model_1.default,
    Users: user_model_1.default,
    Likes: like_model_1.default,
    Comments: comment_model_1.default,
    Challenges: challenge_model_1.default,
};
//# sourceMappingURL=index.js.map