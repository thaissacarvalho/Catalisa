"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengesModule = void 0;
const common_1 = require("@nestjs/common");
const find_all_challenge_controller_1 = require("./application/controllers/find-all-challenge.controller");
const find_id_challenge_controller_1 = require("./application/controllers/find-id-challenge.controller");
const update_challenge_status_controller_1 = require("./application/controllers/update-challenge-status.controller");
const find_all_challenge_use_case_1 = require("./application/use-cases/find-all-challenge.use-case");
const find_id_challenge_use_case_1 = require("./application/use-cases/find-id-challenge.use-case");
const update_challenge_status_use_case_1 = require("./application/use-cases/update-challenge-status.use-case");
const challenge_repository_1 = require("./domain/repositories/challenge.repository");
const sequelize_challenge_repository_1 = require("./infrastructure/persistence/sequelize/repositories/sequelize-challenge.repository");
let ChallengesModule = class ChallengesModule {
};
exports.ChallengesModule = ChallengesModule;
exports.ChallengesModule = ChallengesModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            find_all_challenge_controller_1.FindAllChallengeController,
            find_id_challenge_controller_1.FindIdChallengeController,
            update_challenge_status_controller_1.UpdateChallengeStatusController,
        ],
        providers: [
            find_all_challenge_use_case_1.FindAllChallengeUseCase,
            find_id_challenge_use_case_1.FindIdChallengeUseCase,
            update_challenge_status_use_case_1.UpdateChallengeStatusUseCase,
            {
                provide: challenge_repository_1.CHALLENGE_REPOSITORY,
                useClass: sequelize_challenge_repository_1.SequelizeChallengeRepository,
            },
        ],
        exports: [challenge_repository_1.CHALLENGE_REPOSITORY],
    })
], ChallengesModule);
//# sourceMappingURL=challenges.module.js.map