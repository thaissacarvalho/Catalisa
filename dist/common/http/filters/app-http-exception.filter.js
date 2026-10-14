"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const app_http_exception_1 = require("../app-http.exception");
const error_response_1 = require("../error-response");
const token_codes_1 = require("../token-codes");
let AppHttpExceptionFilter = class AppHttpExceptionFilter {
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        if (exception instanceof app_http_exception_1.AppHttpException) {
            response.status(exception.getStatus()).json(exception.getResponse());
            return;
        }
        const statusCode = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorCode = this.getErrorCode(statusCode);
        response.status(statusCode).json((0, error_response_1.errorResponse)(errorCode));
    }
    getErrorCode(statusCode) {
        if (statusCode === common_1.HttpStatus.BAD_REQUEST) {
            return token_codes_1.TokenCodes.INVALID_REQUEST;
        }
        if (statusCode === common_1.HttpStatus.UNAUTHORIZED) {
            return token_codes_1.TokenCodes.AUTHENTICATION_REQUIRED;
        }
        if (statusCode === common_1.HttpStatus.FORBIDDEN) {
            return token_codes_1.TokenCodes.FORBIDDEN;
        }
        if (statusCode === common_1.HttpStatus.NOT_FOUND) {
            return token_codes_1.TokenCodes.RESOURCE_NOT_FOUND;
        }
        if (statusCode === common_1.HttpStatus.CONFLICT) {
            return token_codes_1.TokenCodes.CONFLICT;
        }
        return token_codes_1.TokenCodes.INTERNAL_SERVER_ERROR;
    }
};
exports.AppHttpExceptionFilter = AppHttpExceptionFilter;
exports.AppHttpExceptionFilter = AppHttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], AppHttpExceptionFilter);
//# sourceMappingURL=app-http-exception.filter.js.map