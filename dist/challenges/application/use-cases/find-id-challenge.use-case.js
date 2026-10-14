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
exports.FindIdChallengeUseCase = void 0;
const ChallengeStatus_enum_1 = require("../../domain/enums/ChallengeStatus.enum");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
const common_1 = require("@nestjs/common");
let FindIdChallengeUseCase = class FindIdChallengeUseCase {
    challengeRepository;
    constructor(challengeRepository) {
        this.challengeRepository = challengeRepository;
    }
    async execute(challengeId) {
        const challenge = await this.challengeRepository.findById(challengeId);
        if (!challenge || challenge.status !== ChallengeStatus_enum_1.ChallengeStatus.ACTIVE) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.CHALLENGE_NOT_FOUND);
        }
        return challenge;
    }
};
exports.FindIdChallengeUseCase = FindIdChallengeUseCase;
exports.FindIdChallengeUseCase = FindIdChallengeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ChallengeRepository')),
    __metadata("design:paramtypes", [Object])
], FindIdChallengeUseCase);
//# sourceMappingURL=find-id-challenge.use-case.js.map