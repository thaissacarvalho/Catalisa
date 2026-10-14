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
exports.FindCommentUseCase = void 0;
const common_1 = require("@nestjs/common");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
let FindCommentUseCase = class FindCommentUseCase {
    commentRepository;
    solutionRepository;
    constructor(commentRepository, solutionRepository) {
        this.commentRepository = commentRepository;
        this.solutionRepository = solutionRepository;
    }
    async execute(id) {
        const comment = await this.commentRepository.find(id);
        if (!comment) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.COMMENT_NOT_FOUND);
        }
        const solutionExist = await this.solutionRepository.findPublishedById(comment.solutionId);
        if (!solutionExist) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_NOT_FOUND);
        }
        return comment;
    }
};
exports.FindCommentUseCase = FindCommentUseCase;
exports.FindCommentUseCase = FindCommentUseCase = __decorate([
    __param(0, (0, common_1.Inject)('CommentRepository')),
    __param(1, (0, common_1.Inject)('SolutionRepository')),
    __metadata("design:paramtypes", [Object, Object])
], FindCommentUseCase);
//# sourceMappingURL=find-comment.use-case.js.map