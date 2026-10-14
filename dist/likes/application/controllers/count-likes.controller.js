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
exports.CountByLikeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const count_by_like_use_case_1 = require("../use-cases/count-by-like.use-case");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const like_target_dto_1 = require("../dto/like-target.dto");
const to_like_target_from_dto_helper_1 = require("../helpers/to-like-target-from-dto.helper");
let CountByLikeController = class CountByLikeController {
    countByLike;
    constructor(countByLike) {
        this.countByLike = countByLike;
    }
    async count(query) {
        const target = (0, to_like_target_from_dto_helper_1.toLikeTargetFromDto)(query);
        const result = await this.countByLike.execute(target);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.LIKES_COUNTED, result);
    }
};
exports.CountByLikeController = CountByLikeController;
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({
        summary: 'Count likes from active users on a visible solution or comment',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Visible likes counted.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [like_target_dto_1.LikeTargetDto]),
    __metadata("design:returntype", Promise)
], CountByLikeController.prototype, "count", null);
exports.CountByLikeController = CountByLikeController = __decorate([
    (0, swagger_1.ApiTags)('Likes'),
    (0, common_1.Controller)('likes'),
    __metadata("design:paramtypes", [count_by_like_use_case_1.CountByLikeUseCase])
], CountByLikeController);
//# sourceMappingURL=count-likes.controller.js.map