"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolutionsModule = void 0;
const common_1 = require("@nestjs/common");
const challenges_module_1 = require("../challenges/challenges.module");
const create_solution_controller_1 = require("./application/controllers/create-solution.controller");
const list_published_solution_controller_1 = require("./application/controllers/list-published-solution.controller");
const list_published_solutions_controller_1 = require("./application/controllers/list-published-solutions.controller");
const list_solutions_for_admin_controller_1 = require("./application/controllers/list-solutions-for-admin.controller");
const update_solution_status_controller_1 = require("./application/controllers/update-solution-status.controller");
const create_solution_use_case_1 = require("./application/use-cases/create-solution.use-case");
const get_published_solution_use_case_1 = require("./application/use-cases/get-published-solution.use-case");
const list_published_solutions_use_case_1 = require("./application/use-cases/list-published-solutions.use-case");
const list_solutions_for_admin_use_case_1 = require("./application/use-cases/list-solutions-for-admin.use-case");
const update_solution_status_use_case_1 = require("./application/use-cases/update-solution-status.use-case");
const sequelize_solution_repository_1 = require("./infrastructure/persistence/sequelize/repositories/sequelize-solution.repository");
const users_module_1 = require("../users/users.module");
const moderation_module_1 = require("../moderation/moderation.module");
let SolutionsModule = class SolutionsModule {
};
exports.SolutionsModule = SolutionsModule;
exports.SolutionsModule = SolutionsModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, challenges_module_1.ChallengesModule, moderation_module_1.ModerationModule],
        controllers: [
            create_solution_controller_1.CreateSolutionController,
            list_published_solution_controller_1.ListPublishedSolutionController,
            list_published_solutions_controller_1.ListPublishedSolutionsController,
            list_solutions_for_admin_controller_1.ListSolutionsForAdminController,
            update_solution_status_controller_1.UpdateSolutionStatusController,
        ],
        providers: [
            create_solution_use_case_1.CreateSolutionUseCase,
            get_published_solution_use_case_1.ListPublishedSolutionUseCase,
            list_published_solutions_use_case_1.ListPublishedSolutionsUseCase,
            list_solutions_for_admin_use_case_1.ListSolutionsForAdminUseCase,
            update_solution_status_use_case_1.UpdateSolutionStatusUseCase,
            {
                provide: 'SolutionRepository',
                useClass: sequelize_solution_repository_1.SequelizeSolutionRepository,
            },
        ],
        exports: ['SolutionRepository'],
    })
], SolutionsModule);
//# sourceMappingURL=solutions.module.js.map