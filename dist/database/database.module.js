"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = exports.DATABASE_CONNECTION = void 0;
const common_1 = require("@nestjs/common");
const model_associations_1 = require("./model-associations");
const sequelize_1 = require("./sequelize");
exports.DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');
let DatabaseModule = class DatabaseModule {
    async onModuleInit() {
        (0, model_associations_1.initializeModelAssociations)();
        await sequelize_1.sequelize.authenticate();
    }
    async onApplicationShutdown() {
        await sequelize_1.sequelize.close();
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.DATABASE_CONNECTION,
                useValue: sequelize_1.sequelize,
            },
        ],
        exports: [exports.DATABASE_CONNECTION],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map