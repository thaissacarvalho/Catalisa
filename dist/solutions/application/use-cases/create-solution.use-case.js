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
exports.CreateSolutionUseCase = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
const ensure_can_publish_solution_1 = require("../../../common/authorization/ensure-can-publish-solution");
const solution_entity_1 = require("../../domain/entities/solution.entity");
const solution_status_enum_1 = require("../../domain/enums/solution-status.enum");
const user_status_enum_1 = require("../../../users/domain/enums/user-status.enum");
let CreateSolutionUseCase = class CreateSolutionUseCase {
    solutionRepository;
    userRepository;
    challengeRepository;
    constructor(solutionRepository, userRepository, challengeRepository) {
        this.solutionRepository = solutionRepository;
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
    }
    async execute(data) {
        const user = await this.userRepository.findByUserCode(data.userCode);
        if (!user) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_USER);
        }
        (0, ensure_can_publish_solution_1.ensureCanPublishSolution)(user.role);
        if (user.status !== user_status_enum_1.UserStatus.ACTIVE) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_USER);
        }
        const challengeExist = await this.challengeRepository.existsActiveById(data.challengeId);
        if (!challengeExist) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.CHALLENGE_NOT_FOUND);
        }
        try {
            return await this.solutionRepository.create(new solution_entity_1.SolutionEntity((0, node_crypto_1.randomUUID)(), data.userCode, data.challengeId, data.title.trim(), data.description.trim(), solution_status_enum_1.SolutionStatus.PUBLISHED, null, null, null));
        }
        catch {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_CREATION_FAILED);
        }
    }
};
exports.CreateSolutionUseCase = CreateSolutionUseCase;
exports.CreateSolutionUseCase = CreateSolutionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SolutionRepository')),
    __param(1, (0, common_1.Inject)('UserRepository')),
    __param(2, (0, common_1.Inject)('ChallengeRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateSolutionUseCase);
//# sourceMappingURL=create-solution.use-case.js.map