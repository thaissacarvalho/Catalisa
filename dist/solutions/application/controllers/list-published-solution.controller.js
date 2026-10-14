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
exports.ListPublishedSolutionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const solution_id_param_dto_1 = require("../dto/solution-id-param.dto");
const solution_presenter_1 = require("../presenters/solution.presenter");
const get_published_solution_use_case_1 = require("../use-cases/get-published-solution.use-case");
let ListPublishedSolutionController = class ListPublishedSolutionController {
    listPublishedSolutionUseCase;
    constructor(listPublishedSolutionUseCase) {
        this.listPublishedSolutionUseCase = listPublishedSolutionUseCase;
    }
    async get(params) {
        const solution = await this.listPublishedSolutionUseCase.execute(params.solutionId);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.SOLUTION_FOUND, solution_presenter_1.SolutionPresenter.public(solution));
    }
};
exports.ListPublishedSolutionController = ListPublishedSolutionController;
__decorate([
    (0, common_1.Get)(':solutionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a published solution' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Solution found.' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [solution_id_param_dto_1.SolutionIdParamDto]),
    __metadata("design:returntype", Promise)
], ListPublishedSolutionController.prototype, "get", null);
exports.ListPublishedSolutionController = ListPublishedSolutionController = __decorate([
    (0, swagger_1.ApiTags)('Solutions'),
    (0, common_1.Controller)('solutions'),
    __metadata("design:paramtypes", [get_published_solution_use_case_1.ListPublishedSolutionUseCase])
], ListPublishedSolutionController);
//# sourceMappingURL=list-published-solution.controller.js.map