"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserCode = generateUserCode;
const node_crypto_1 = require("node:crypto");
function generateUserCode() {
    const randomCode = (0, node_crypto_1.randomBytes)(16).toString('hex');
    return `USER_${randomCode}`;
}
//# sourceMappingURL=generateUserCode.js.map