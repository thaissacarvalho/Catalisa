"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = errorResponse;
function errorResponse(errorCode) {
    return {
        success: false,
        type: errorCode.type,
        code: errorCode.code,
        message: errorCode.message,
        statusCode: errorCode.statusCode,
    };
}
//# sourceMappingURL=error-response.js.map