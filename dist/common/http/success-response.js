"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
function successResponse(successCode, data) {
    return {
        success: true,
        type: successCode.type,
        code: successCode.code,
        message: successCode.message,
        statusCode: successCode.statusCode,
        data,
    };
}
//# sourceMappingURL=success-response.js.map