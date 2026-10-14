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
exports.UpdateSolutionStatusController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../common/authentication/decorators/roles.decorator");
const admin_password_updated_guard_1 = require("../../../common/authentication/guards/admin-password-updated.guard");
const jwt_auth_guard_1 = require("../../../common/authentication/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/authentication/guards/roles.guard");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const solution_id_param_dto_1 = require("../dto/solution-id-param.dto");
const update_solution_status_dto_1 = require("../dto/update-solution-status.dto");
const solution_presenter_1 = require("../presenters/solution.presenter");
const update_solution_status_use_case_1 = require("../use-cases/update-solution-status.use-case");
const user_role_enum_1 = require("../../../users/domain/enums/user-role.enum");
let UpdateSolutionStatusController = class UpdateSolutionStatusController {
    updateSolutionStatusUseCase;
    constructor(updateSolutionStatusUseCase) {
        this.updateSolutionStatusUseCase = updateSolutionStatusUseCase;
    }
    async update(params, data, request) {
        const solution = await this.updateSolutionStatusUseCase.execute(params.solutionId, data.status, request.user.userCode, data.reason, request.user.role);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.SOLUTION_STATUS_UPDATED, solution_presenter_1.SolutionPresenter.statusUpdated(solution));
    }
};
exports.UpdateSolutionStatusController = UpdateSolutionStatusController;
__decorate([
    (0, common_1.Patch)(':solutionId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove or republish a solution' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Solution status updated.' }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [solution_id_param_dto_1.SolutionIdParamDto,
        update_solution_status_dto_1.UpdateSolutionStatusDto, Object]),
    __metadata("design:returntype", Promise)
], UpdateSolutionStatusController.prototype, "update", null);
exports.UpdateSolutionStatusController = UpdateSolutionStatusController = __decorate([
    (0, swagger_1.ApiTags)('Solutions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/solutions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, admin_password_updated_guard_1.AdminPasswordUpdatedGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [update_solution_status_use_case_1.UpdateSolutionStatusUseCase])
], UpdateSolutionStatusController);
//# sourceMappingURL=update-solution-status.controller.js.map