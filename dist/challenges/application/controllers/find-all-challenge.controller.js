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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllChallengeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const find_all_challenge_use_case_1 = require("../use-cases/find-all-challenge.use-case");
const challenge_presenter_1 = require("../presenters/challenge.presenter");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
let FindAllChallengeController = class FindAllChallengeController {
    findAllChallengeUseCase;
    constructor(findAllChallengeUseCase) {
        this.findAllChallengeUseCase = findAllChallengeUseCase;
    }
    async findAll() {
        const challenges = await this.findAllChallengeUseCase.execute();
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.CHALLENGES_LISTED, challenges.map((challenge) => challenge_presenter_1.ChallengePresenter.public(challenge)));
    }
};
exports.FindAllChallengeController = FindAllChallengeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List active challenges' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Challenges listed.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FindAllChallengeController.prototype, "findAll", null);
exports.FindAllChallengeController = FindAllChallengeController = __decorate([
    (0, swagger_1.ApiTags)('Challenges'),
    (0, common_1.Controller)('challenges'),
    __metadata("design:paramtypes", [find_all_challenge_use_case_1.FindAllChallengeUseCase])
], FindAllChallengeController);
//# sourceMappingURL=find-all-challenge.controller.js.map