"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const environment_1 = require("../config/environment");
exports.sequelize = new sequelize_1.Sequelize({
    dialect: 'postgres',
    host: environment_1.environment.database.host,
    port: environment_1.environment.database.port,
    username: environment_1.environment.database.username,
    password: environment_1.environment.database.password,
    database: environment_1.environment.database.name,
});
//# sourceMappingURL=sequelize.js.map