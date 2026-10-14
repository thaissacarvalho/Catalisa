"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHttpException = void 0;
const common_1 = require("@nestjs/common");
const error_response_1 = require("./error-response");
class AppHttpException extends common_1.HttpException {
    constructor(errorCode) {
        super((0, error_response_1.errorResponse)(errorCode), errorCode.statusCode);
    }
}
exports.AppHttpException = AppHttpException;
//# sourceMappingURL=app-http.exception.js.map