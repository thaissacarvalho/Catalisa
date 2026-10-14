"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCanLike = ensureCanLike;
const app_http_exception_1 = require("../http/app-http.exception");
const token_codes_1 = require("../http/token-codes");
const user_role_enum_1 = require("../../users/domain/enums/user-role.enum");
function ensureCanLike(role) {
    if (role !== user_role_enum_1.UserRole.PARTICIPANT && role !== user_role_enum_1.UserRole.SUPER_ADMIN) {
        throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.FORBIDDEN);
    }
}
//# sourceMappingURL=ensure-can-like.js.map