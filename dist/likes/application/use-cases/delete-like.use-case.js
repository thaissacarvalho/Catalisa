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
exports.DeleteLikeUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_status_enum_1 = require("../../../users/domain/enums/user-status.enum");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
const ensure_can_like_1 = require("../../../common/authorization/ensure-can-like");
let DeleteLikeUseCase = class DeleteLikeUseCase {
    likeRepository;
    userRepository;
    constructor(likeRepository, userRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
    }
    async execute(userCode, target) {
        const user = await this.userRepository.findByUserCode(userCode);
        if (!user)
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.USER_NOT_FOUND);
        (0, ensure_can_like_1.ensureCanLike)(user.role);
        if (user.status !== user_status_enum_1.UserStatus.ACTIVE) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.FORBIDDEN);
        }
        // Removal remains possible when the target is hidden and is idempotent.
        await this.likeRepository.deleteByUserAndTarget(userCode, target);
    }
};
exports.DeleteLikeUseCase = DeleteLikeUseCase;
exports.DeleteLikeUseCase = DeleteLikeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LikeRepository')),
    __param(1, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object, Object])
], DeleteLikeUseCase);
//# sourceMappingURL=delete-like.use-case.js.map