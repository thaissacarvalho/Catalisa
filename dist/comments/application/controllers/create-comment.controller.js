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
exports.CreateCommentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_comment_dto_1 = require("../dto/create-comment.dto");
const create_comment_use_case_1 = require("../use-cases/create-comment.use-case");
const token_codes_1 = require("../../../common/http/token-codes");
const success_response_1 = require("../../../common/http/success-response");
let CreateCommentController = class CreateCommentController {
    createCommentUseCase;
    constructor(createCommentUseCase) {
        this.createCommentUseCase = createCommentUseCase;
    }
    async create(data) {
        const comment = await this.createCommentUseCase.execute(data);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.COMMENT_CREATED, comment);
    }
};
exports.CreateCommentController = CreateCommentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new comment' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Comment created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], CreateCommentController.prototype, "create", null);
exports.CreateCommentController = CreateCommentController = __decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [create_comment_use_case_1.CreateCommentUseCase])
], CreateCommentController);
//# sourceMappingURL=create-comment.controller.js.map