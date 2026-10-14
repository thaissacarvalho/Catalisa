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
exports.CreateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
const user_entity_1 = require("../../domain/entities/user.entity");
const user_role_enum_1 = require("../../domain/enums/user-role.enum");
const user_status_enum_1 = require("../../domain/enums/user-status.enum");
const generateUserCode_1 = require("../../../utils/generateUserCode");
let CreateUserUseCase = class CreateUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        const normalizedEmail = data.email.trim().toLowerCase();
        const existingUser = await this.userRepository.findByEmail(normalizedEmail);
        if (existingUser) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.USER_ALREADY_EXISTS);
        }
        const user = await this.userRepository.create(new user_entity_1.UserEntity(crypto.randomUUID(), data.name.trim(), normalizedEmail, user_status_enum_1.UserStatus.ACTIVE, user_role_enum_1.UserRole.PARTICIPANT, data.jobPosition.trim(), data.enterprise.trim(), (0, generateUserCode_1.generateUserCode)()));
        return user;
    }
};
exports.CreateUserUseCase = CreateUserUseCase;
exports.CreateUserUseCase = CreateUserUseCase = __decorate([
    __param(0, (0, common_1.Inject)('UserRepository')),
    __metadata("design:paramtypes", [Object])
], CreateUserUseCase);
//# sourceMappingURL=create-user.use-case.js.map