"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const environment_1 = require("../../config/environment");
const users_module_1 = require("../../users/users.module");
const authentication_controller_1 = require("./authentication.controller");
const authentication_service_1 = require("./authentication.service");
const admin_credential_repository_1 = require("./domain/repositories/admin-credential.repository");
const sequelize_admin_credential_repository_1 = require("./infrastructure/persistence/sequelize/repositories/sequelize-admin-credential.repository");
const admin_password_updated_guard_1 = require("./guards/admin-password-updated.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
let AuthenticationModule = class AuthenticationModule {
};
exports.AuthenticationModule = AuthenticationModule;
exports.AuthenticationModule = AuthenticationModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            jwt_1.JwtModule.register({
                secret: environment_1.environment.authentication.jwtSecret,
                signOptions: {
                    expiresIn: environment_1.environment.authentication.jwtExpiresInSeconds,
                    issuer: environment_1.environment.authentication.jwtIssuer,
                    audience: environment_1.environment.authentication.jwtAudience,
                    algorithm: 'HS256',
                },
                verifyOptions: {
                    issuer: environment_1.environment.authentication.jwtIssuer,
                    audience: environment_1.environment.authentication.jwtAudience,
                    algorithms: ['HS256'],
                },
            }),
        ],
        controllers: [authentication_controller_1.AuthenticationController],
        providers: [
            authentication_service_1.AuthenticationService,
            {
                provide: admin_credential_repository_1.ADMIN_CREDENTIAL_REPOSITORY,
                useClass: sequelize_admin_credential_repository_1.SequelizeAdminCredentialRepository,
            },
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            admin_password_updated_guard_1.AdminPasswordUpdatedGuard,
        ],
        exports: [
            users_module_1.UsersModule,
            admin_credential_repository_1.ADMIN_CREDENTIAL_REPOSITORY,
            authentication_service_1.AuthenticationService,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            admin_password_updated_guard_1.AdminPasswordUpdatedGuard,
            jwt_1.JwtModule,
        ],
    })
], AuthenticationModule);
//# sourceMappingURL=authentication.module.js.map