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
exports.UpdateCommentStatusUseCase = void 0;
const comment_status_enum_1 = require("../../domain/enums/comment-status.enum");
const ensure_admin_1 = require("../../../common/authorization/ensure-admin");
const app_http_exception_1 = require("../../../common/http/app-http.exception");
const token_codes_1 = require("../../../common/http/token-codes");
const user_role_enum_1 = require("../../../users/domain/enums/user-role.enum");
const direct_removal_use_case_1 = require("../../../moderation/application/use-cases/direct-removal.use-case");
const target_type_enum_1 = require("../../../common/domain/enums/target-type.enum");
const common_1 = require("@nestjs/common");
let UpdateCommentStatusUseCase = class UpdateCommentStatusUseCase {
    commentRepository;
    directRemovalUseCase;
    constructor(commentRepository, directRemovalUseCase) {
        this.commentRepository = commentRepository;
        this.directRemovalUseCase = directRemovalUseCase;
    }
    async execute(id, status, actorUserCode, actorRole, reason) {
        (0, ensure_admin_1.ensureAdmin)(actorRole);
        if (!Object.values(comment_status_enum_1.CommentStatus).includes(status)) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_COMMENT);
        }
        if (status === comment_status_enum_1.CommentStatus.EXCLUDED) {
            if (actorRole !== user_role_enum_1.UserRole.SUPER_ADMIN) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.REMOVAL_REQUIRES_APPROVAL);
            }
            if (!reason?.trim()) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.COMMENT_MODERATION_REASON_REQUIRED);
            }
        }
        if (status === comment_status_enum_1.CommentStatus.EXCLUDED) {
            await this.directRemovalUseCase.execute(target_type_enum_1.TargetType.COMMENT, id, reason, actorUserCode);
            const removedComment = await this.commentRepository.findById(id);
            if (!removedComment) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.COMMENT_NOT_FOUND);
            }
            return removedComment;
        }
        const comment = await this.commentRepository.updateStatus(id, status);
        if (!comment) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.COMMENT_NOT_FOUND);
        }
        return comment;
    }
};
exports.UpdateCommentStatusUseCase = UpdateCommentStatusUseCase;
exports.UpdateCommentStatusUseCase = UpdateCommentStatusUseCase = __decorate([
    __param(0, (0, common_1.Inject)('CommentRepository')),
    __metadata("design:paramtypes", [Object, direct_removal_use_case_1.DirectRemovalUseCase])
], UpdateCommentStatusUseCase);
//# sourceMappingURL=update-comment-status.use-case.js.map