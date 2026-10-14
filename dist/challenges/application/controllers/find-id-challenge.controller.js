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
exports.FindIdChallengeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const challenge_id_param_dto_1 = require("../dto/challenge-id-param.dto");
const challenge_presenter_1 = require("../presenters/challenge.presenter");
const find_id_challenge_use_case_1 = require("../use-cases/find-id-challenge.use-case");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
let FindIdChallengeController = class FindIdChallengeController {
    findIdChallengeUseCase;
    constructor(findIdChallengeUseCase) {
        this.findIdChallengeUseCase = findIdChallengeUseCase;
    }
    async find(params) {
        const challenge = await this.findIdChallengeUseCase.execute(params.challengeId);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.CHALLENGE_FOUND, challenge_presenter_1.ChallengePresenter.public(challenge));
    }
};
exports.FindIdChallengeController = FindIdChallengeController;
__decorate([
    (0, common_1.Get)(':challengeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an active challenge by ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Challenge found.' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [challenge_id_param_dto_1.ChallengeIdParamDto]),
    __metadata("design:returntype", Promise)
], FindIdChallengeController.prototype, "find", null);
exports.FindIdChallengeController = FindIdChallengeController = __decorate([
    (0, swagger_1.ApiTags)('Challenges'),
    (0, common_1.Controller)('challenges'),
    __metadata("design:paramtypes", [find_id_challenge_use_case_1.FindIdChallengeUseCase])
], FindIdChallengeController);
//# sourceMappingURL=find-id-challenge.controller.js.map