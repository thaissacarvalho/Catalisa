"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const environment_1 = require("../../config/environment");
const app_http_exception_1 = require("../http/app-http.exception");
const token_codes_1 = require("../http/token-codes");
const user_role_enum_1 = require("../../users/domain/enums/user-role.enum");
const user_status_enum_1 = require("../../users/domain/enums/user-status.enum");
const generateUserCode_1 = require("../../utils/generateUserCode");
const node_crypto_1 = require("node:crypto");
const user_entity_1 = require("../../users/domain/entities/user.entity");
// Public dummy hash used only to equalize invalid-login response time.
const INVALID_ADMIN_PASSWORD_HASH = '$2b$12$MELp0E97iHDwgli5ZgvZ1eO6b7AwmJ6ipwJKY3VxIt1B2MRuh5rom';
let AuthenticationService = class AuthenticationService {
    jwtService;
    userRepository;
    adminCredentialRepository;
    constructor(jwtService, userRepository, adminCredentialRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.adminCredentialRepository = adminCredentialRepository;
    }
    async loginAdmin(email, password) {
        this.assertBcryptPasswordLength(password);
        const user = await this.userRepository.findByEmail(email.trim().toLowerCase());
        if (!user || ![user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN].includes(user.role)) {
            await bcrypt.compare(password, INVALID_ADMIN_PASSWORD_HASH);
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_ADMIN_CREDENTIALS);
        }
        if (user.status !== user_status_enum_1.UserStatus.ACTIVE) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.ADMIN_ACCOUNT_INACTIVE);
        }
        const credential = await this.adminCredentialRepository.findByUserId(user.id);
        const passwordHash = credential?.passwordHash ?? INVALID_ADMIN_PASSWORD_HASH;
        const passwordMatches = await bcrypt.compare(password, passwordHash);
        if (!credential || !passwordMatches) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_ADMIN_CREDENTIALS);
        }
        return {
            accessToken: await this.signAccessToken(user.id, user.userCode, user.role, credential.mustChangePassword, credential.passwordChangedAt),
            user: {
                userCode: user.userCode,
                role: user.role,
                mustChangePassword: credential.mustChangePassword,
            },
        };
    }
    async promoteToAdmin(userCode) {
        const user = await this.userRepository.findByUserCode(userCode);
        if (!user) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.USER_NOT_FOUND);
        }
        if (user.role !== user_role_enum_1.UserRole.PARTICIPANT) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.USER_CANNOT_BE_PROMOTED);
        }
        const temporaryPassword = (0, node_crypto_1.randomBytes)(24).toString('base64url');
        this.assertBcryptPasswordLength(temporaryPassword);
        const passwordHash = await bcrypt.hash(temporaryPassword, 12);
        const credential = await this.adminCredentialRepository.promoteParticipantToAdmin(user.id, passwordHash);
        if (!credential) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.USER_CANNOT_BE_PROMOTED);
        }
        return {
            userCode: user.userCode,
            role: user_role_enum_1.UserRole.ADMIN,
            mustChangePassword: credential.mustChangePassword,
            temporaryPassword,
        };
    }
    async updateAdminPassword(userCode, currentPassword, newPassword) {
        this.assertBcryptPasswordLength(currentPassword);
        this.assertBcryptPasswordLength(newPassword);
        const user = await this.userRepository.findByUserCode(userCode);
        if (!user || ![user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN].includes(user.role)) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_ADMIN_CREDENTIALS);
        }
        const credential = await this.adminCredentialRepository.findByUserId(user.id);
        if (!credential ||
            !(await bcrypt.compare(currentPassword, credential.passwordHash))) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_ADMIN_CREDENTIALS);
        }
        if (await bcrypt.compare(newPassword, credential.passwordHash)) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.PASSWORD_UNCHANGED);
        }
        const passwordHash = await bcrypt.hash(newPassword, 12);
        const updatedCredential = await this.adminCredentialRepository.updatePassword(user.id, passwordHash);
        if (!updatedCredential) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_ADMIN_CREDENTIALS);
        }
        return {
            accessToken: await this.signAccessToken(user.id, user.userCode, user.role, updatedCredential.mustChangePassword, updatedCredential.passwordChangedAt),
            user: {
                userCode: user.userCode,
                role: user.role,
                mustChangePassword: updatedCredential.mustChangePassword,
            },
        };
    }
    assertBcryptPasswordLength(password) {
        const characterLength = Array.from(password).length;
        const byteLength = Buffer.byteLength(password, 'utf8');
        if (characterLength < 8 || byteLength > 72) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_PASSWORD_LENGTH);
        }
    }
    signAccessToken(id, userCode, role, mustChangePassword, passwordChangedAt) {
        return this.jwtService.signAsync({
            sub: id,
            userCode,
            role,
            mustChangePassword,
            credentialVersion: passwordChangedAt?.toISOString() ?? null,
            type: 'ACCESS',
        });
    }
    async createInitialSuperAdmin() {
        const config = environment_1.environment.authentication.initialSuperAdmin;
        if (!config.name ||
            !config.email ||
            !config.jobPosition ||
            !config.enterprise ||
            !config.password) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INITIAL_SUPER_ADMIN_CONFIGURATION_INVALID);
        }
        const superAdminExists = await this.userRepository.existsByRole(user_role_enum_1.UserRole.SUPER_ADMIN);
        if (superAdminExists) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SUPER_ADMIN_ALREADY_EXISTS);
        }
        const normalizedEmail = config.email.trim().toLowerCase();
        const emailAlreadyExists = await this.userRepository.findByEmail(normalizedEmail);
        if (emailAlreadyExists) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.EMAIL_ALREADY_EXISTS);
        }
        this.assertBcryptPasswordLength(config.password);
        const user = new user_entity_1.UserEntity((0, node_crypto_1.randomUUID)(), config.name.trim(), normalizedEmail, user_status_enum_1.UserStatus.ACTIVE, user_role_enum_1.UserRole.SUPER_ADMIN, config.jobPosition.trim(), config.enterprise.trim(), (0, generateUserCode_1.generateUserCode)());
        const passwordHash = await bcrypt.hash(config.password, 12);
        const credential = await this.adminCredentialRepository.createInitialSuperAdmin(user, passwordHash);
        return {
            userCode: user.userCode,
            email: user.email,
            role: user.role,
            mustChangePassword: credential.mustChangePassword,
        };
    }
};
exports.AuthenticationService = AuthenticationService;
exports.AuthenticationService = AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('UserRepository')),
    __param(2, (0, common_1.Inject)('AdminCredentialRepository')),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object, Object])
], AuthenticationService);
//# sourceMappingURL=authentication.service.js.map