"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeModerationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const app_http_exception_1 = require("../../../../../common/http/app-http.exception");
const token_codes_1 = require("../../../../../common/http/token-codes");
const sequelize_2 = require("../../../../../database/sequelize");
const moderation_request_status_enum_1 = require("../../../../domain/enums/moderation-request-status.enum");
const moderation_target_helper_1 = require("../helpers/moderation-target.helper");
const moderation_request_mapper_1 = require("../mappers/moderation-request.mapper");
const moderation_request_model_1 = __importDefault(require("../models/moderation-request.model"));
const moderationUserIncludes = [
    {
        association: 'requestedBy',
        attributes: ['userCode', 'name', 'email'],
        required: true,
    },
    {
        association: 'reviewedBy',
        attributes: ['userCode', 'name', 'email'],
        required: false,
    },
];
let SequelizeModerationRepository = class SequelizeModerationRepository {
    async create(request) {
        try {
            return await sequelize_2.sequelize.transaction(async (transaction) => {
                await (0, moderation_target_helper_1.ensureModerationTargetCanBeRemoved)(request.targetType, request.targetId, transaction);
                const model = await moderation_request_model_1.default.create(moderation_request_mapper_1.ModerationRequestMapper.toPersistence(request), { transaction });
                return this.toDetails(model, transaction);
            });
        }
        catch (error) {
            if (error instanceof sequelize_1.UniqueConstraintError) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.MODERATION_REQUEST_ALREADY_PENDING);
            }
            throw error;
        }
    }
    async removeDirect(request) {
        const reviewerUserCode = request.reviewedByUserCode;
        if (request.status !== moderation_request_status_enum_1.ModerationRequestStatus.APPROVED ||
            !reviewerUserCode) {
            throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.INVALID_PERSISTENCE_DATA);
        }
        return sequelize_2.sequelize.transaction(async (transaction) => {
            await (0, moderation_target_helper_1.ensureModerationTargetCanBeRemoved)(request.targetType, request.targetId, transaction);
            const pendingRequest = await moderation_request_model_1.default.findOne({
                where: {
                    status: moderation_request_status_enum_1.ModerationRequestStatus.PENDING,
                    ...(0, moderation_target_helper_1.moderationTargetWhere)(request.targetType, request.targetId),
                },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (pendingRequest) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.MODERATION_REQUEST_ALREADY_PENDING);
            }
            const model = await moderation_request_model_1.default.create(moderation_request_mapper_1.ModerationRequestMapper.toPersistence(request), { transaction });
            await (0, moderation_target_helper_1.removeModerationTarget)(model, reviewerUserCode, transaction);
            return this.toDetails(model, transaction);
        });
    }
    async findAll(status) {
        const requests = await moderation_request_model_1.default.findAll({
            ...(status ? { where: { status } } : {}),
            include: moderationUserIncludes,
            order: [['createdAt', 'DESC']],
        });
        return requests.map(moderation_request_mapper_1.ModerationRequestMapper.toDetails);
    }
    async review(input) {
        return sequelize_2.sequelize.transaction(async (transaction) => {
            const request = await moderation_request_model_1.default.findByPk(input.requestId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!request) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.MODERATION_REQUEST_NOT_FOUND);
            }
            if (request.status !== moderation_request_status_enum_1.ModerationRequestStatus.PENDING) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.MODERATION_REQUEST_ALREADY_REVIEWED);
            }
            if (request.requestedByUserCode === input.reviewerUserCode) {
                throw new app_http_exception_1.AppHttpException(token_codes_1.TokenCodes.SELF_APPROVAL_NOT_ALLOWED);
            }
            if (input.decision === moderation_request_status_enum_1.ModerationRequestStatus.APPROVED) {
                await (0, moderation_target_helper_1.removeModerationTarget)(request, input.reviewerUserCode, transaction);
            }
            request.status = input.decision;
            request.reviewedByUserCode = input.reviewerUserCode;
            request.reviewReason = input.reviewReason.trim();
            request.reviewedAt = new Date();
            await request.save({ transaction });
            return this.toDetails(request, transaction);
        });
    }
    async toDetails(request, transaction) {
        await request.reload({
            include: moderationUserIncludes,
            transaction,
        });
        return moderation_request_mapper_1.ModerationRequestMapper.toDetails(request);
    }
};
exports.SequelizeModerationRepository = SequelizeModerationRepository;
exports.SequelizeModerationRepository = SequelizeModerationRepository = __decorate([
    (0, common_1.Injectable)()
], SequelizeModerationRepository);
//# sourceMappingURL=sequelize-moderation.repository.js.map