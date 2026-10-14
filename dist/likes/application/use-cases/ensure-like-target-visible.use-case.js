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
exports.EnsureLikeTargetVisibleUseCase = void 0;
const common_1 = require("@nestjs/common");
const target_type_enum_1 = require("../../../common/domain/enums/target-type.enum");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
let EnsureLikeTargetVisibleUseCase = class EnsureLikeTargetVisibleUseCase {
    solutionRepository;
    commentRepository;
    constructor(solutionRepository, commentRepository) {
        this.solutionRepository = solutionRepository;
        this.commentRepository = commentRepository;
    }
    async execute(target) {
        if (target.type === target_type_enum_1.TargetType.SOLUTION) {
            const solution = await this.solutionRepository.findPublishedById(target.solutionId);
            if (!solution) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_NOT_FOUND);
            }
        }
        else if (target.type === target_type_enum_1.TargetType.COMMENT) {
            const comment = await this.commentRepository.find(target.commentId);
            if (!comment) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.COMMENT_NOT_FOUND);
            }
        }
        else {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_REQUEST);
        }
    }
};
exports.EnsureLikeTargetVisibleUseCase = EnsureLikeTargetVisibleUseCase;
exports.EnsureLikeTargetVisibleUseCase = EnsureLikeTargetVisibleUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SolutionRepository')),
    __param(1, (0, common_1.Inject)('CommentRepository')),
    __metadata("design:paramtypes", [Object, Object])
], EnsureLikeTargetVisibleUseCase);
//# sourceMappingURL=ensure-like-target-visible.use-case.js.map