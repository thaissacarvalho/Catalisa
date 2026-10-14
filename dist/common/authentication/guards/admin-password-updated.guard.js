"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPasswordUpdatedGuard = void 0;
const common_1 = require("@nestjs/common");
const app_http_exception_1 = require("../../http/app-http.exception");
const token_codes_1 = require("../../http/token-codes");
let AdminPasswordUpdatedGuard = class AdminPasswordUpdatedGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.user?.mustChangePassword) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.PASSWORD_UPDATE_REQUIRED);
        }
        return true;
    }
};
exports.AdminPasswordUpdatedGuard = AdminPasswordUpdatedGuard;
exports.AdminPasswordUpdatedGuard = AdminPasswordUpdatedGuard = __decorate([
    (0, common_1.Injectable)()
], AdminPasswordUpdatedGuard);
//# sourceMappingURL=admin-password-updated.guard.js.map