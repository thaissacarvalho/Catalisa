"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAdmin = ensureAdmin;
const app_http_exception_1 = require("../http/app-http.exception");
const token_codes_1 = require("../http/token-codes");
const user_role_enum_1 = require("../../users/domain/enums/user-role.enum");
function ensureAdmin(role) {
    if (role !== user_role_enum_1.UserRole.ADMIN && role !== user_role_enum_1.UserRole.SUPER_ADMIN) {
        throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.FORBIDDEN);
    }
}
//# sourceMappingURL=ensure-admin.js.map