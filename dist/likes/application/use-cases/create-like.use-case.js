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
exports.CreateLikeUseCase = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const like_entity_1 = require("../../domain/entities/like.entity");
const user_status_enum_1 = require("../../../users/domain/enums/user-status.enum");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
const ensure_can_like_1 = require("../../../common/authorization/ensure-can-like");
const ensure_like_target_visible_use_case_1 = require("./ensure-like-target-visible.use-case");
let CreateLikeUseCase = class CreateLikeUseCase {
    likeRepository;
    userRepository;
    visibleTarget;
    constructor(likeRepository, userRepository, visibleTarget) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.visibleTarget = visibleTarget;
    }
    async execute(userCode, target) {
        const user = await this.userRepository.findByUserCode(userCode);
        if (!user)
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.USER_NOT_FOUND);
        (0, ensure_can_like_1.ensureCanLike)(user.role);
        if (user.status !== user_status_enum_1.UserStatus.ACTIVE) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.FORBIDDEN);
        }
        await this.visibleTarget.execute(target);
        const existingLike = await this.likeRepository.findByUserAndTarget(userCode, target);
        if (existingLike) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.LIKE_ALREADY_EXISTS);
        }
        const like = new like_entity_1.LikeEntity((0, node_crypto_1.randomUUID)(), userCode, target);
        const createdLike = await this.likeRepository.createLike(like);
        return createdLike;
    }
};
exports.CreateLikeUseCase = CreateLikeUseCase;
exports.CreateLikeUseCase = CreateLikeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LikeRepository')),
    __param(1, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object, Object, ensure_like_target_visible_use_case_1.EnsureLikeTargetVisibleUseCase])
], CreateLikeUseCase);
//# sourceMappingURL=create-like.use-case.js.map