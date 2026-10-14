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
exports.GetUserByUserCodeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const success_response_1 = require("../../../common/http/success-response");
const token_codes_1 = require("../../../common/http/token-codes");
const list_user_by_user_code_use_case_1 = require("../use-cases/list-user-by-user-code.use-case");
let GetUserByUserCodeController = class GetUserByUserCodeController {
    listUserByUserCodeUseCase;
    constructor(listUserByUserCodeUseCase) {
        this.listUserByUserCodeUseCase = listUserByUserCodeUseCase;
    }
    async findBy(userCode) {
        const user = await this.listUserByUserCodeUseCase.execute(userCode);
        if (!user) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.USER_NOT_FOUND);
        }
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.USER_FOUND, {
            userCode: user.userCode,
            name: user.name,
            jobPosition: user.jobPosition,
            enterprise: user.enterprise,
        });
    }
};
exports.GetUserByUserCodeController = GetUserByUserCodeController;
__decorate([
    (0, common_1.Get)('/:userCode'),
    (0, swagger_1.ApiOperation)({ summary: 'Find a public user profile by hash' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User found.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.' }),
    __param(0, (0, common_1.Param)('userCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GetUserByUserCodeController.prototype, "findBy", null);
exports.GetUserByUserCodeController = GetUserByUserCodeController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [list_user_by_user_code_use_case_1.ListUserByUserCodeUseCase])
], GetUserByUserCodeController);
//# sourceMappingURL=list-user-by-user-code.controller.js.map