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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const list_all_users_use_case_1 = require("../use-cases/list-all-users.use-case");
const user_role_enum_1 = require("../../domain/enums/user-role.enum");
const roles_decorator_1 = require("../../../common/authentication/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../common/authentication/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/authentication/guards/roles.guard");
const admin_password_updated_guard_1 = require("../../../common/authentication/guards/admin-password-updated.guard");
let ListUsersController = class ListUsersController {
    listAllUsersUseCase;
    constructor(listAllUsersUseCase) {
        this.listAllUsersUseCase = listAllUsersUseCase;
    }
    async findAll() {
        const users = await this.listAllUsersUseCase.execute();
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.USERS_LISTED, users);
    }
};
exports.ListUsersController = ListUsersController;
__decorate([
    (0, common_1.Get)('/findAll'),
    (0, swagger_1.ApiOperation)({ summary: 'List users' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Users found.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: '[]' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListUsersController.prototype, "findAll", null);
exports.ListUsersController = ListUsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, admin_password_updated_guard_1.AdminPasswordUpdatedGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [list_all_users_use_case_1.ListAllUsersUseCase])
], ListUsersController);
//# sourceMappingURL=list-all-user.controller.js.map