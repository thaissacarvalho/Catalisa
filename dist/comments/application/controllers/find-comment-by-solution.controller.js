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
exports.FindCommentBySolutionController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const find_comment_by_solution_use_case_1 = require("../use-cases/find-comment-by-solution.use-case");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
let FindCommentBySolutionController = class FindCommentBySolutionController {
    findCommentBySolutionUseCase;
    constructor(findCommentBySolutionUseCase) {
        this.findCommentBySolutionUseCase = findCommentBySolutionUseCase;
    }
    async findBySolution(solutionId) {
        const comments = await this.findCommentBySolutionUseCase.execute(solutionId);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.COMMENT_FOUND, comments);
    }
};
exports.FindCommentBySolutionController = FindCommentBySolutionController;
__decorate([
    (0, common_2.Get)(':solutionId/comments'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Find comments by solution ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Comments found.' }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Comments vinculed by solution not found',
    }),
    __param(0, (0, common_2.Param)('solutionId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FindCommentBySolutionController.prototype, "findBySolution", null);
exports.FindCommentBySolutionController = FindCommentBySolutionController = __decorate([
    (0, swagger_1.ApiTags)('comments'),
    (0, common_2.Controller)('solutions'),
    __metadata("design:paramtypes", [find_comment_by_solution_use_case_1.FindCommentBySolutionUseCase])
], FindCommentBySolutionController);
//# sourceMappingURL=find-comment-by-solution.controller.js.map