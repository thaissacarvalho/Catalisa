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
exports.ListPublishedSolutionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const challenge_id_param_dto_1 = require("../dto/challenge-id-param.dto");
const solution_presenter_1 = require("../presenters/solution.presenter");
const list_published_solutions_use_case_1 = require("../use-cases/list-published-solutions.use-case");
let ListPublishedSolutionsController = class ListPublishedSolutionsController {
    listPublishedSolutionsUseCase;
    constructor(listPublishedSolutionsUseCase) {
        this.listPublishedSolutionsUseCase = listPublishedSolutionsUseCase;
    }
    async list(params) {
        const solutions = await this.listPublishedSolutionsUseCase.execute(params.challengeId);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.SOLUTIONS_LISTED, solutions.map((solution) => solution_presenter_1.SolutionPresenter.public(solution)));
    }
};
exports.ListPublishedSolutionsController = ListPublishedSolutionsController;
__decorate([
    (0, common_1.Get)('/:challengeId/solutions'),
    (0, swagger_1.ApiOperation)({ summary: 'List published solutions for a challenge' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Solutions listed.' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [challenge_id_param_dto_1.ChallengeIdParamDto]),
    __metadata("design:returntype", Promise)
], ListPublishedSolutionsController.prototype, "list", null);
exports.ListPublishedSolutionsController = ListPublishedSolutionsController = __decorate([
    (0, swagger_1.ApiTags)('Solutions'),
    (0, common_1.Controller)('challenges'),
    __metadata("design:paramtypes", [list_published_solutions_use_case_1.ListPublishedSolutionsUseCase])
], ListPublishedSolutionsController);
//# sourceMappingURL=list-published-solutions.controller.js.map