"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLikeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_like_target_dto_1 = require("../dto/user-like-target.dto");
const to_like_target_from_dto_helper_1 = require("../helpers/to-like-target-from-dto.helper");
const delete_like_use_case_1 = require("../use-cases/delete-like.use-case");
let DeleteLikeController = class DeleteLikeController {
    deleteLike;
    constructor(deleteLike) {
        this.deleteLike = deleteLike;
    }
    async remove(query) {
        await this.deleteLike.execute(query.userCode, (0, to_like_target_from_dto_helper_1.toLikeTargetFromDto)(query));
    }
};
exports.DeleteLikeController = DeleteLikeController;
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an active participant’s like' }),
    (0, swagger_1.ApiNoContentResponse)({ description: 'Like absent or removed.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_like_target_dto_1.UserLikeTargetDto]),
    __metadata("design:returntype", Promise)
], DeleteLikeController.prototype, "remove", null);
exports.DeleteLikeController = DeleteLikeController = __decorate([
    (0, swagger_1.ApiTags)('Likes'),
    (0, common_1.Controller)('likes'),
    __metadata("design:paramtypes", [delete_like_use_case_1.DeleteLikeUseCase])
], DeleteLikeController);
//# sourceMappingURL=delete-like.controller.js.map