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
exports.UpdateSolutionStatusUseCase = void 0;
const common_1 = require("@nestjs/common");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
const solution_status_enum_1 = require("../../domain/enums/solution-status.enum");
const ensure_admin_1 = require("../../../common/authorization/ensure-admin");
const user_role_enum_1 = require("../../../users/domain/enums/user-role.enum");
const direct_removal_use_case_1 = require("../../../moderation/application/use-cases/direct-removal.use-case");
const target_type_enum_1 = require("../../../common/domain/enums/target-type.enum");
let UpdateSolutionStatusUseCase = class UpdateSolutionStatusUseCase {
    solutionRepository;
    directRemovalUseCase;
    constructor(solutionRepository, directRemovalUseCase) {
        this.solutionRepository = solutionRepository;
        this.directRemovalUseCase = directRemovalUseCase;
    }
    async execute(solutionId, status, moderatorUserCode, reason, actorRole) {
        (0, ensure_admin_1.ensureAdmin)(actorRole); // Ensure the user has admin privileges before proceeding
        const solution = await this.solutionRepository.findById(solutionId);
        if (!solution) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_NOT_FOUND);
        }
        if (solution.status === status) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_STATUS_UNCHANGED);
        }
        if (status === solution_status_enum_1.SolutionStatus.REMOVED &&
            actorRole !== user_role_enum_1.UserRole.SUPER_ADMIN) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.REMOVAL_REQUIRES_APPROVAL);
        }
        if (status === solution_status_enum_1.SolutionStatus.REMOVED && !reason?.trim()) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_MODERATION_REASON_REQUIRED);
        }
        if (status === solution_status_enum_1.SolutionStatus.REMOVED) {
            await this.directRemovalUseCase.execute(target_type_enum_1.TargetType.SOLUTION, solutionId, reason, moderatorUserCode);
            const removedSolution = await this.solutionRepository.findById(solutionId);
            if (!removedSolution) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_NOT_FOUND);
            }
            return removedSolution;
        }
        const updatedSolution = await this.solutionRepository.updateStatus({
            solutionId,
            status,
            moderationReason: null,
            moderatedByUserCode: null,
            moderatedAt: null,
        });
        if (!updatedSolution) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SOLUTION_NOT_FOUND);
        }
        return updatedSolution;
    }
};
exports.UpdateSolutionStatusUseCase = UpdateSolutionStatusUseCase;
exports.UpdateSolutionStatusUseCase = UpdateSolutionStatusUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SolutionRepository')),
    __metadata("design:paramtypes", [Object, direct_removal_use_case_1.DirectRemovalUseCase])
], UpdateSolutionStatusUseCase);
//# sourceMappingURL=update-solution-status.use-case.js.map