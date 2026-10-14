"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_var_1 = __importDefault(require("env-var"));
require("dotenv/config");
const sequelizeCliConfig = {
    development: {
        username: env_var_1.default.get('DB_USERNAME').required().asString(),
        password: env_var_1.default.get('DB_PASSWORD').required().asString(),
        database: env_var_1.default.get('DB_NAME').required().asString(),
        host: env_var_1.default.get('DB_HOST').required().asString(),
        port: env_var_1.default.get('DB_PORT').required().asPortNumber(),
        dialect: 'postgres',
    },
    production: {
        username: env_var_1.default.get('DB_USERNAME').required().asString(),
        password: env_var_1.default.get('DB_PASSWORD').required().asString(),
        database: env_var_1.default.get('DB_NAME').required().asString(),
        host: env_var_1.default.get('DB_HOST').required().asString(),
        port: env_var_1.default.get('DB_PORT').required().asPortNumber(),
        dialect: 'postgres',
    },
};
exports.default = sequelizeCliConfig;
//# sourceMappingURL=sequelizeCli.js.map