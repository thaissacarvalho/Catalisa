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
exports.ListRemovalRequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../common/authentication/decorators/roles.decorator");
const admin_password_updated_guard_1 = require("../../../common/authentication/guards/admin-password-updated.guard");
const jwt_auth_guard_1 = require("../../../common/authentication/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/authentication/guards/roles.guard");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const list_removal_requests_query_dto_1 = require("../dto/list-removal-requests-query.dto");
const list_removal_requests_use_case_1 = require("../use-cases/list-removal-requests.use-case");
const user_role_enum_1 = require("../../../users/domain/enums/user-role.enum");
let ListRemovalRequestsController = class ListRemovalRequestsController {
    listRemovalRequestsUseCase;
    constructor(listRemovalRequestsUseCase) {
        this.listRemovalRequestsUseCase = listRemovalRequestsUseCase;
    }
    async list(query, request) {
        const result = await this.listRemovalRequestsUseCase.execute(request.user.role, query.status);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.MODERATION_REQUESTS_LISTED, result);
    }
};
exports.ListRemovalRequestsController = ListRemovalRequestsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List removal requests' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Removal requests listed.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_removal_requests_query_dto_1.ListRemovalRequestsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], ListRemovalRequestsController.prototype, "list", null);
exports.ListRemovalRequestsController = ListRemovalRequestsController = __decorate([
    (0, swagger_1.ApiTags)('Moderation'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/moderation/removal-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, admin_password_updated_guard_1.AdminPasswordUpdatedGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [list_removal_requests_use_case_1.ListRemovalRequestsUseCase])
], ListRemovalRequestsController);
//# sourceMappingURL=list-removal-requests.controller.js.map