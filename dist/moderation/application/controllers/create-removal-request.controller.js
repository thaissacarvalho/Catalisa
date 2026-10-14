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
exports.CreateRemovalRequestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../common/authentication/decorators/roles.decorator");
const admin_password_updated_guard_1 = require("../../../common/authentication/guards/admin-password-updated.guard");
const jwt_auth_guard_1 = require("../../../common/authentication/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/authentication/guards/roles.guard");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const create_removal_request_dto_1 = require("../dto/create-removal-request.dto");
const create_removal_request_use_case_1 = require("../use-cases/create-removal-request.use-case");
const user_role_enum_1 = require("../../../users/domain/enums/user-role.enum");
let CreateRemovalRequestController = class CreateRemovalRequestController {
    createRemovalRequestUseCase;
    constructor(createRemovalRequestUseCase) {
        this.createRemovalRequestUseCase = createRemovalRequestUseCase;
    }
    async create(data, request) {
        const result = await this.createRemovalRequestUseCase.execute(data.targetType, data.targetId, data.reason, request.user.userCode, request.user.role);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.MODERATION_REQUEST_CREATED, result);
    }
};
exports.CreateRemovalRequestController = CreateRemovalRequestController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Request logical removal of a solution or comment' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Removal request created.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_removal_request_dto_1.CreateRemovalRequestDto, Object]),
    __metadata("design:returntype", Promise)
], CreateRemovalRequestController.prototype, "create", null);
exports.CreateRemovalRequestController = CreateRemovalRequestController = __decorate([
    (0, swagger_1.ApiTags)('Moderation'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/moderation/removal-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, admin_password_updated_guard_1.AdminPasswordUpdatedGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [create_removal_request_use_case_1.CreateRemovalRequestUseCase])
], CreateRemovalRequestController);
//# sourceMappingURL=create-removal-request.controller.js.map