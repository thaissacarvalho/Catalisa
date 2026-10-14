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
exports.CreateCommentUseCase = void 0;
const user_status_enum_1 = require("../../../users/domain/enums/user-status.enum");
const comment_entity_1 = require("../../domain/entities/comment.entity");
const common_1 = require("@nestjs/common");
const comment_status_enum_1 = require("../../domain/enums/comment-status.enum");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
let CreateCommentUseCase = class CreateCommentUseCase {
    solutionRepository;
    commentRepository;
    userRepository;
    constructor(solutionRepository, commentRepository, userRepository) {
        this.solutionRepository = solutionRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }
    async execute(data) {
        const text = typeof data.comment === 'string' ? data.comment.trim() : '';
        if (Array.from(text).length < 50 || Array.from(text).length > 280) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_COMMENT);
        }
        const user = await this.userRepository.findByUserCode(data.userCode);
        if (!user) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.USER_NOT_FOUND);
        }
        if (user.status !== user_status_enum_1.UserStatus.ACTIVE) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.FORBIDDEN);
        }
        const solution = await this.solutionRepository.findPublishedById(data.solutionId);
        if (!solution) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_NOT_FOUND);
        }
        if (data.parentCommentId) {
            const parent = await this.commentRepository.find(data.parentCommentId);
            if (!parent || parent.solutionId !== data.solutionId) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.PARENT_COMMENT_NOT_FOUND);
            }
        }
        const comment = new comment_entity_1.CommentEntity(crypto.randomUUID(), data.solutionId, data.parentCommentId ?? null, data.userCode, text, comment_status_enum_1.CommentStatus.ACTIVE);
        return this.commentRepository.create(comment);
    }
};
exports.CreateCommentUseCase = CreateCommentUseCase;
exports.CreateCommentUseCase = CreateCommentUseCase = __decorate([
    __param(0, (0, common_1.Inject)('SolutionRepository')),
    __param(1, (0, common_1.Inject)('CommentRepository')),
    __param(2, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateCommentUseCase);
//# sourceMappingURL=create-comment.use-case.js.map