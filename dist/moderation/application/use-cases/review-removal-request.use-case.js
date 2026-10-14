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
exports.ReviewRemovalRequestUseCase = void 0;
const common_1 = require("@nestjs/common");
const ensure_admin_1 = require("../../../common/authorization/ensure-admin");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
let ReviewRemovalRequestUseCase = class ReviewRemovalRequestUseCase {
    moderationRepository;
    constructor(moderationRepository) {
        this.moderationRepository = moderationRepository;
    }
    execute(requestId, decision, reviewerUserCode, reviewerRole, reason) {
        (0, ensure_admin_1.ensureAdmin)(reviewerRole);
        if (!reason.trim()) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.REVIEW_REASON_REQUIRED);
        }
        return this.moderationRepository.review({
            requestId,
            decision,
            reviewerUserCode,
            reviewReason: reason,
        });
    }
};
exports.ReviewRemovalRequestUseCase = ReviewRemovalRequestUseCase;
exports.ReviewRemovalRequestUseCase = ReviewRemovalRequestUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ModerationRepository')),
    __metadata("design:paramtypes", [Object])
], ReviewRemovalRequestUseCase);
//# sourceMappingURL=review-removal-request.use-case.js.map