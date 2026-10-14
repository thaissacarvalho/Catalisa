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
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const authentication_service_1 = require("./authentication.service");
const roles_decorator_1 = require("./decorators/roles.decorator");
const admin_login_dto_1 = require("./dto/admin-login.dto");
const update_admin_password_dto_1 = require("./dto/update-admin-password.dto");
const admin_password_updated_guard_1 = require("./guards/admin-password-updated.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const success_response_1 = require("../http/success-response");
const token_codes_1 = require("../http/token-codes");
const user_role_enum_1 = require("../../users/domain/enums/user-role.enum");
let AuthenticationController = class AuthenticationController {
    authenticationService;
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    async login(data) {
        const authentication = await this.authenticationService.loginAdmin(data.email, data.password);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.ADMIN_AUTHENTICATED, authentication);
    }
    me(request) {
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.AUTHENTICATED_IDENTITY_RETRIEVED, {
            userCode: request.user.userCode,
            role: request.user.role,
            mustChangePassword: request.user.mustChangePassword,
        });
    }
    async updatePassword(request, data) {
        const result = await this.authenticationService.updateAdminPassword(request.user.userCode, data.currentPassword, data.newPassword);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.ADMIN_PASSWORD_UPDATED, result);
    }
    async promote(userCode) {
        const admin = await this.authenticationService.promoteToAdmin(userCode);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.USER_PROMOTED_TO_ADMIN, admin);
    }
};
exports.AuthenticationController = AuthenticationController;
__decorate([
    (0, common_1.Post)('admin/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'Login as an admin' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDto]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get the authenticated identity' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)('admin/password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an admin password' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_admin_password_dto_1.UpdateAdminPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('admin/users/:userCode/promote'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, admin_password_updated_guard_1.AdminPasswordUpdatedGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, swagger_1.ApiOperation)({ summary: 'Promote a participant to admin' }),
    __param(0, (0, common_1.Param)('userCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "promote", null);
exports.AuthenticationController = AuthenticationController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('authentication'),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], AuthenticationController);
//# sourceMappingURL=authentication.controller.js.map