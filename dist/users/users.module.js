"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const create_user_controller_1 = require("./application/controllers/create-user.controller");
const list_user_by_user_code_controller_1 = require("./application/controllers/list-user-by-user-code.controller");
const update_user_by_status_controller_1 = require("./application/controllers/update-user-by-status.controller");
const sequelize_user_repository_1 = require("./infrastructure/persistence/sequelize/repositories/sequelize-user.repository");
const create_user_use_case_1 = require("./application/use-cases/create-user.use-case");
const list_user_by_user_code_use_case_1 = require("./application/use-cases/list-user-by-user-code.use-case");
const update_user_status_use_case_1 = require("./application/use-cases/update-user-status.use-case");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            create_user_controller_1.CreateUserController,
            list_user_by_user_code_controller_1.GetUserByUserCodeController,
            update_user_by_status_controller_1.UpdateUserByStatusController,
        ],
        providers: [
            create_user_use_case_1.CreateUserUseCase,
            list_user_by_user_code_use_case_1.ListUserByUserCodeUseCase,
            update_user_status_use_case_1.UpdateUserStatusUseCase,
            {
                provide: 'UserRepository',
                useClass: sequelize_user_repository_1.SequelizeUserRepository,
            },
        ],
        exports: ['UserRepository', update_user_status_use_case_1.UpdateUserStatusUseCase],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map