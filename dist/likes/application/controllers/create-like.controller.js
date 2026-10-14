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
exports.CreateLikeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const user_like_target_dto_1 = require("../dto/user-like-target.dto");
const to_like_target_from_dto_helper_1 = require("../helpers/to-like-target-from-dto.helper");
const create_like_use_case_1 = require("../use-cases/create-like.use-case");
let CreateLikeController = class CreateLikeController {
    createLike;
    constructor(createLike) {
        this.createLike = createLike;
    }
    async create(data) {
        const like = await this.createLike.execute(data.userCode, (0, to_like_target_from_dto_helper_1.toLikeTargetFromDto)(data));
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.LIKE_CREATED, like);
    }
};
exports.CreateLikeController = CreateLikeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Like a visible solution or comment as an active participant',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Like created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_like_target_dto_1.UserLikeTargetDto]),
    __metadata("design:returntype", Promise)
], CreateLikeController.prototype, "create", null);
exports.CreateLikeController = CreateLikeController = __decorate([
    (0, swagger_1.ApiTags)('Likes'),
    (0, common_1.Controller)('likes'),
    __metadata("design:paramtypes", [create_like_use_case_1.CreateLikeUseCase])
], CreateLikeController);
//# sourceMappingURL=create-like.controller.js.map