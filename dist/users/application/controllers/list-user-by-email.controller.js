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
exports.ListUserByEmailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const list_user_by_email_use_case_1 = require("../use-cases/list-user-by-email.use-case");
const roles_decorator_1 = require("../../../common/authentication/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../common/authentication/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/authentication/guards/roles.guard");
const admin_password_updated_guard_1 = require("../../../common/authentication/guards/admin-password-updated.guard");
const user_role_enum_1 = require("../../domain/enums/user-role.enum");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
let ListUserByEmailController = class ListUserByEmailController {
    listUserByEmailUseCase;
    constructor(listUserByEmailUseCase) {
        this.listUserByEmailUseCase = listUserByEmailUseCase;
    }
    async findBy(email) {
        const user = await this.listUserByEmailUseCase.execute(email);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.USER_FOUND, user);
    }
};
exports.ListUserByEmailController = ListUserByEmailController;
__decorate([
    (0, common_1.Get)('/:email'),
    (0, swagger_1.ApiOperation)({ summary: 'Find a user by email' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User found.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListUserByEmailController.prototype, "findBy", null);
exports.ListUserByEmailController = ListUserByEmailController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, admin_password_updated_guard_1.AdminPasswordUpdatedGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [list_user_by_email_use_case_1.ListUserByEmailUseCase])
], ListUserByEmailController);
//# sourceMappingURL=list-user-by-email.controller.js.map