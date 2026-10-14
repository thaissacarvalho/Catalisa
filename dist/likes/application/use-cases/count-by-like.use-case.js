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
exports.CountByLikeUseCase = void 0;
const common_1 = require("@nestjs/common");
const ensure_like_target_visible_use_case_1 = require("./ensure-like-target-visible.use-case");
let CountByLikeUseCase = class CountByLikeUseCase {
    likeRepository;
    visibleTarget;
    constructor(likeRepository, visibleTarget) {
        this.likeRepository = likeRepository;
        this.visibleTarget = visibleTarget;
    }
    async execute(target) {
        await this.visibleTarget.execute(target);
        const count = await this.likeRepository.countBy(target);
        const result = { count };
        return result;
    }
};
exports.CountByLikeUseCase = CountByLikeUseCase;
exports.CountByLikeUseCase = CountByLikeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LikeRepository')),
    __metadata("design:paramtypes", [Object, ensure_like_target_visible_use_case_1.EnsureLikeTargetVisibleUseCase])
], CountByLikeUseCase);
//# sourceMappingURL=count-by-like.use-case.js.map