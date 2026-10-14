"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationModule = void 0;
const common_1 = require("@nestjs/common");
const approve_removal_request_controller_1 = require("./application/controllers/approve-removal-request.controller");
const create_removal_request_controller_1 = require("./application/controllers/create-removal-request.controller");
const list_removal_requests_controller_1 = require("./application/controllers/list-removal-requests.controller");
const reject_removal_request_controller_1 = require("./application/controllers/reject-removal-request.controller");
const create_removal_request_use_case_1 = require("./application/use-cases/create-removal-request.use-case");
const direct_removal_use_case_1 = require("./application/use-cases/direct-removal.use-case");
const list_removal_requests_use_case_1 = require("./application/use-cases/list-removal-requests.use-case");
const review_removal_request_use_case_1 = require("./application/use-cases/review-removal-request.use-case");
const sequelize_moderation_repository_1 = require("./infrastructure/persistence/sequelize/repositories/sequelize-moderation.repository");
let ModerationModule = class ModerationModule {
};
exports.ModerationModule = ModerationModule;
exports.ModerationModule = ModerationModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            create_removal_request_controller_1.CreateRemovalRequestController,
            list_removal_requests_controller_1.ListRemovalRequestsController,
            approve_removal_request_controller_1.ApproveRemovalRequestController,
            reject_removal_request_controller_1.RejectRemovalRequestController,
        ],
        providers: [
            create_removal_request_use_case_1.CreateRemovalRequestUseCase,
            direct_removal_use_case_1.DirectRemovalUseCase,
            list_removal_requests_use_case_1.ListRemovalRequestsUseCase,
            review_removal_request_use_case_1.ReviewRemovalRequestUseCase,
            {
                provide: 'ModerationRepository',
                useClass: sequelize_moderation_repository_1.SequelizeModerationRepository,
            },
        ],
        exports: [direct_removal_use_case_1.DirectRemovalUseCase],
    })
], ModerationModule);
//# sourceMappingURL=moderation.module.js.map