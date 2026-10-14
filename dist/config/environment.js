"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const env_var_1 = __importDefault(require("env-var"));
require("dotenv/config");
const jwtSecret = env_var_1.default.get('JWT_SECRET').required().asString();
if (Buffer.byteLength(jwtSecret, 'utf8') < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes');
}
const nodeEnv = env_var_1.default
    .get('NODE_ENV')
    .default('development')
    .asEnum(['development', 'test', 'production']);
exports.environment = {
    nodeEnv,
    app: {
        host: env_var_1.default.get('APP_HOST').default('0.0.0.0').asString(),
        port: env_var_1.default.get('APP_PORT').default('3000').asPortNumber(),
    },
    database: {
        host: env_var_1.default.get('DB_HOST').required().asString(),
        port: env_var_1.default.get('DB_PORT').required().asPortNumber(),
        name: env_var_1.default.get('DB_NAME').required().asString(),
        username: env_var_1.default.get('DB_USERNAME').required().asString(),
        password: env_var_1.default.get('DB_PASSWORD').required().asString(),
    },
    authentication: {
        jwtSecret,
        jwtExpiresInSeconds: env_var_1.default
            .get('JWT_EXPIRES_IN_SECONDS')
            .default('28800')
            .asIntPositive(),
        jwtIssuer: env_var_1.default.get('JWT_ISSUER').default('token-api').asString(),
        jwtAudience: env_var_1.default.get('JWT_AUDIENCE').default('token-admin').asString(),
        initialSuperAdmin: {
            name: process.env.INITIAL_SUPER_ADMIN_NAME ?? '',
            email: process.env.INITIAL_SUPER_ADMIN_EMAIL ?? '',
            jobPosition: process.env.INITIAL_SUPER_ADMIN_JOB_POSITION ?? '',
            enterprise: process.env.INITIAL_SUPER_ADMIN_ENTERPRISE ?? '',
            password: process.env.INITIAL_SUPER_ADMIN_PASSWORD ?? '',
        },
    },
};
//# sourceMappingURL=environment.js.map