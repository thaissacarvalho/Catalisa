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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const app_http_exception_1 = require("../../http/app-http.exception");
const token_codes_1 = require("../../http/token-codes");
const user_role_enum_1 = require("../../../users/domain/enums/user-role.enum");
const user_status_enum_1 = require("../../../users/domain/enums/user-status.enum");
const admin_credential_repository_1 = require("../domain/repositories/admin-credential.repository");
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    userRepository;
    adminCredentialRepository;
    constructor(jwtService, userRepository, adminCredentialRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.adminCredentialRepository = adminCredentialRepository;
    }
    async canActivate(context) {
        const request = context
            .switchToHttp()
            .getRequest();
        const token = request.headers.authorization?.startsWith('Bearer ')
            ? request.headers.authorization.slice(7)
            : undefined;
        if (!token) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.AUTHENTICATION_REQUIRED);
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            if (!this.isAccessTokenPayload(payload)) {
                throw new Error('Invalid access token payload');
            }
            const [user, credential] = await Promise.all([
                this.userRepository.findById(payload.sub),
                this.adminCredentialRepository.findByUserId(payload.sub),
            ]);
            const currentCredentialVersion = credential?.passwordChangedAt?.toISOString() ?? null;
            if (!user ||
                !credential ||
                user.status !== user_status_enum_1.UserStatus.ACTIVE ||
                user.userCode !== payload.userCode ||
                user.role !== payload.role ||
                credential.mustChangePassword !== payload.mustChangePassword ||
                currentCredentialVersion !== payload.credentialVersion) {
                throw new Error('Stale access token');
            }
            request.user = payload;
            return true;
        }
        catch {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_ACCESS_TOKEN);
        }
    }
    isAccessTokenPayload(payload) {
        if (typeof payload !== 'object' || payload === null) {
            return false;
        }
        const candidate = payload;
        return (candidate.type === 'ACCESS' &&
            typeof candidate.sub === 'string' &&
            candidate.sub.length > 0 &&
            typeof candidate.userCode === 'string' &&
            candidate.userCode.length > 0 &&
            Object.values(user_role_enum_1.UserRole).includes(candidate.role) &&
            typeof candidate.mustChangePassword === 'boolean' &&
            (candidate.credentialVersion === null ||
                typeof candidate.credentialVersion === 'string') &&
            typeof candidate.iat === 'number' &&
            typeof candidate.exp === 'number');
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('UserRepository')),
    __param(2, (0, common_1.Inject)(admin_credential_repository_1.ADMIN_CREDENTIAL_REPOSITORY)),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object, Object])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map