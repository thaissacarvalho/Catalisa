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
exports.UpdateChallengeStatusController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const challenge_id_param_dto_1 = require("../dto/challenge-id-param.dto");
const update_challenge_status_dto_1 = require("../dto/update-challenge-status.dto");
const challenge_presenter_1 = require("../presenters/challenge.presenter");
const update_challenge_status_use_case_1 = require("../use-cases/update-challenge-status.use-case");
const roles_decorator_1 = require("../../../common/authentication/decorators/roles.decorator");
const admin_password_updated_guard_1 = require("../../../common/authentication/guards/admin-password-updated.guard");
const jwt_auth_guard_1 = require("../../../common/authentication/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/authentication/guards/roles.guard");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const user_role_enum_1 = require("../../../users/domain/enums/user-role.enum");
let UpdateChallengeStatusController = class UpdateChallengeStatusController {
    updateChallengeStatusUseCase;
    constructor(updateChallengeStatusUseCase) {
        this.updateChallengeStatusUseCase = updateChallengeStatusUseCase;
    }
    async update(params, data) {
        const challenge = await this.updateChallengeStatusUseCase.execute(params.challengeId, data.status);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.CHALLENGE_STATUS_UPDATED, challenge_presenter_1.ChallengePresenter.statusUpdated(challenge));
    }
};
exports.UpdateChallengeStatusController = UpdateChallengeStatusController;
__decorate([
    (0, common_1.Patch)(':challengeId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate or deactivate a challenge' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Challenge status updated.' }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [challenge_id_param_dto_1.ChallengeIdParamDto,
        update_challenge_status_dto_1.UpdateChallengeStatusDto]),
    __metadata("design:returntype", Promise)
], UpdateChallengeStatusController.prototype, "update", null);
exports.UpdateChallengeStatusController = UpdateChallengeStatusController = __decorate([
    (0, swagger_1.ApiTags)('Challenges'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/challenges'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, admin_password_updated_guard_1.AdminPasswordUpdatedGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [update_challenge_status_use_case_1.UpdateChallengeStatusUseCase])
], UpdateChallengeStatusController);
//# sourceMappingURL=update-challenge-status.controller.js.map