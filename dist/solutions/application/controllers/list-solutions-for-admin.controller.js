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
exports.ListSolutionsForAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../common/authentication/decorators/roles.decorator");
const admin_password_updated_guard_1 = require("../../../common/authentication/guards/admin-password-updated.guard");
const jwt_auth_guard_1 = require("../../../common/authentication/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/authentication/guards/roles.guard");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const solution_presenter_1 = require("../presenters/solution.presenter");
const list_solutions_for_admin_use_case_1 = require("../use-cases/list-solutions-for-admin.use-case");
const user_role_enum_1 = require("../../../users/domain/enums/user-role.enum");
let ListSolutionsForAdminController = class ListSolutionsForAdminController {
    listSolutionsForAdminUseCase;
    constructor(listSolutionsForAdminUseCase) {
        this.listSolutionsForAdminUseCase = listSolutionsForAdminUseCase;
    }
    async list(request) {
        const solutions = await this.listSolutionsForAdminUseCase.execute(request.user.role);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.SOLUTIONS_LISTED, solutions.map((solution) => solution_presenter_1.SolutionPresenter.admin(solution)));
    }
};
exports.ListSolutionsForAdminController = ListSolutionsForAdminController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all solutions for moderation' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Solutions listed.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListSolutionsForAdminController.prototype, "list", null);
exports.ListSolutionsForAdminController = ListSolutionsForAdminController = __decorate([
    (0, swagger_1.ApiTags)('Solutions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/solutions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, admin_password_updated_guard_1.AdminPasswordUpdatedGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [list_solutions_for_admin_use_case_1.ListSolutionsForAdminUseCase])
], ListSolutionsForAdminController);
//# sourceMappingURL=list-solutions-for-admin.controller.js.map