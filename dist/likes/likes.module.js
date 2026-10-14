"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesModule = void 0;
const users_module_1 = require("../users/users.module");
const create_like_controller_1 = require("./application/controllers/create-like.controller");
const delete_like_controller_1 = require("./application/controllers/delete-like.controller");
const create_like_use_case_1 = require("./application/use-cases/create-like.use-case");
const delete_like_use_case_1 = require("./application/use-cases/delete-like.use-case");
const ensure_like_target_visible_use_case_1 = require("./application/use-cases/ensure-like-target-visible.use-case");
const common_1 = require("@nestjs/common");
const solutions_module_1 = require("../solutions/solutions.module");
const sequelize_like_repository_1 = require("./infrastructure/persistence/sequelize/repositories/sequelize-like.repository");
const comments_module_1 = require("../comments/comments.module");
const count_likes_controller_1 = require("./application/controllers/count-likes.controller");
const count_by_like_use_case_1 = require("./application/use-cases/count-by-like.use-case");
let LikesModule = class LikesModule {
};
exports.LikesModule = LikesModule;
exports.LikesModule = LikesModule = __decorate([
    (0, common_1.Module)({
        imports: [solutions_module_1.SolutionsModule, comments_module_1.CommentsModule, users_module_1.UsersModule],
        controllers: [
            count_likes_controller_1.CountByLikeController,
            create_like_controller_1.CreateLikeController,
            delete_like_controller_1.DeleteLikeController,
        ],
        providers: [
            count_by_like_use_case_1.CountByLikeUseCase,
            create_like_use_case_1.CreateLikeUseCase,
            delete_like_use_case_1.DeleteLikeUseCase,
            ensure_like_target_visible_use_case_1.EnsureLikeTargetVisibleUseCase,
            { provide: 'LikeRepository', useClass: sequelize_like_repository_1.SequelizeLikeRepository },
        ],
    })
], LikesModule);
//# sourceMappingURL=likes.module.js.map