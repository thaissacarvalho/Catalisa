"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const solutions_module_1 = require("../solutions/solutions.module");
const users_module_1 = require("../users/users.module");
const moderation_module_1 = require("../moderation/moderation.module");
const common_1 = require("@nestjs/common");
const create_comment_controller_1 = require("./application/controllers/create-comment.controller");
const find_comment_controller_1 = require("./application/controllers/find-comment.controller");
const update_comment_status_controller_1 = require("./application/controllers/update-comment-status.controller");
const sequelize_comment_repository_1 = require("./infrastructure/persistence/sequelize/repositories/sequelize-comment.repository");
const create_comment_use_case_1 = require("./application/use-cases/create-comment.use-case");
const find_comment_use_case_1 = require("./application/use-cases/find-comment.use-case");
const update_comment_status_use_case_1 = require("./application/use-cases/update-comment-status.use-case");
const find_comment_by_solution_controller_1 = require("./application/controllers/find-comment-by-solution.controller");
const find_comment_by_solution_use_case_1 = require("./application/use-cases/find-comment-by-solution.use-case");
let CommentsModule = class CommentsModule {
};
exports.CommentsModule = CommentsModule;
exports.CommentsModule = CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [solutions_module_1.SolutionsModule, users_module_1.UsersModule, moderation_module_1.ModerationModule],
        controllers: [
            create_comment_controller_1.CreateCommentController,
            find_comment_controller_1.FindCommentController,
            find_comment_by_solution_controller_1.FindCommentBySolutionController,
            update_comment_status_controller_1.UpdateCommentStatusController,
        ],
        providers: [
            create_comment_use_case_1.CreateCommentUseCase,
            find_comment_use_case_1.FindCommentUseCase,
            find_comment_by_solution_use_case_1.FindCommentBySolutionUseCase,
            update_comment_status_use_case_1.UpdateCommentStatusUseCase,
            {
                provide: 'CommentRepository',
                useClass: sequelize_comment_repository_1.SequelizeCommentRepository,
            },
        ],
        exports: [
            'CommentRepository',
            create_comment_use_case_1.CreateCommentUseCase,
            find_comment_use_case_1.FindCommentUseCase,
            update_comment_status_use_case_1.UpdateCommentStatusUseCase,
        ],
    })
], CommentsModule);
//# sourceMappingURL=comments.module.js.map