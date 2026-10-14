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
exports.FindCommentController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const token_codes_1 = require("../../../common/http/token-codes");
const success_response_1 = require("../../../common/http/success-response");
const find_comment_use_case_1 = require("../use-cases/find-comment.use-case");
let FindCommentController = class FindCommentController {
    findCommentUseCase;
    constructor(findCommentUseCase) {
        this.findCommentUseCase = findCommentUseCase;
    }
    async create(id) {
        const comment = await this.findCommentUseCase.execute(id);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.COMMENT_FOUND, comment);
    }
};
exports.FindCommentController = FindCommentController;
__decorate([
    (0, common_2.Get)('/:commentId'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Find a comment' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Comment found.' }),
    __param(0, (0, common_2.Param)('commentId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FindCommentController.prototype, "create", null);
exports.FindCommentController = FindCommentController = __decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, common_2.Controller)('comments'),
    __metadata("design:paramtypes", [find_comment_use_case_1.FindCommentUseCase])
], FindCommentController);
//# sourceMappingURL=find-comment.controller.js.map