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
exports.UpdateCommentStatusController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const token_codes_1 = require("../../../common/http/token-codes");
const success_response_1 = require("../../../common/http/success-response");
const update_comment_status_use_case_1 = require("../use-cases/update-comment-status.use-case");
const update_comment_status_dto_1 = require("../dto/update-comment-status.dto");
const roles_decorator_1 = require("../../../common/authentication/decorators/roles.decorator");
const user_role_enum_1 = require("../../../users/domain/enums/user-role.enum");
const common_3 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/authentication/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/authentication/guards/roles.guard");
const admin_password_updated_guard_1 = require("../../../common/authentication/guards/admin-password-updated.guard");
let UpdateCommentStatusController = class UpdateCommentStatusController {
    updateCommentStatusUseCase;
    constructor(updateCommentStatusUseCase) {
        this.updateCommentStatusUseCase = updateCommentStatusUseCase;
    }
    async updateStatus(id, data, request) {
        const comment = await this.updateCommentStatusUseCase.execute(id, data.status, request.user.userCode, request.user.role, data.reason);
        return (0, success_response_1.successResponse)(token_codes_1.TokenCodes.COMMENT_STATUS_UPDATED, comment);
    }
};
exports.UpdateCommentStatusController = UpdateCommentStatusController;
__decorate([
    (0, common_2.Patch)(':commentId/status'),
    (0, common_2.HttpCode)(common_2.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update comment status' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Comment status updated.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Comment id not found' }),
    __param(0, (0, common_2.Param)('commentId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_comment_status_dto_1.UpdateCommentStatusDto, Object]),
    __metadata("design:returntype", Promise)
], UpdateCommentStatusController.prototype, "updateStatus", null);
exports.UpdateCommentStatusController = UpdateCommentStatusController = __decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, common_2.Controller)('comments/admin'),
    (0, common_3.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, admin_password_updated_guard_1.AdminPasswordUpdatedGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [update_comment_status_use_case_1.UpdateCommentStatusUseCase])
], UpdateCommentStatusController);
//# sourceMappingURL=update-comment-status.controller.js.map