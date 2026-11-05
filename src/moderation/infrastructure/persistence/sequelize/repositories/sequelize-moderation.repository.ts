import { Injectable } from '@nestjs/common';
import { UniqueConstraintError, type Transaction } from 'sequelize';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { sequelize } from '@app/database/sequelize';
import { ModerationRequestDetails } from '@app/moderation/domain/entities/moderation-request-details.entity';
import { ModerationRequestEntity } from '@app/moderation/domain/entities/moderation-request.entity';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { ReviewModerationRequestInput } from '@app/moderation/domain/repositories/inputs/review-moderation-request.input';
import { ModerationRepository } from '@app/moderation/domain/repositories/moderation.repository';
import {
  ensureModerationTargetCanBeRemoved,
  moderationTargetWhere,
  removeModerationTarget,
} from '@app/moderation/infrastructure/persistence/sequelize/helpers/moderation-target.helper';
import { ModerationRequestMapper } from '@app/moderation/infrastructure/persistence/sequelize/mappers/moderation-request.mapper';
import ModerationRequestModel from '@app/moderation/infrastructure/persistence/sequelize/models/moderation-request.model';

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

@Injectable()
export class SequelizeModerationRepository implements ModerationRepository {
  async create(
    request: ModerationRequestEntity,
  ): Promise<ModerationRequestDetails> {
    try {
      return await sequelize.transaction(async (transaction) => {
        await ensureModerationTargetCanBeRemoved(
          request.targetType,
          request.targetId,
          transaction,
        );

        const model = await ModerationRequestModel.create(
          ModerationRequestMapper.toPersistence(request),
          { transaction },
        );

        return this.toDetails(model, transaction);
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new AppHttpException(
          CatalisaCodes.MODERATION_REQUEST_ALREADY_PENDING,
        );
      }

      throw error;
    }
  }

  async removeDirect(
    request: ModerationRequestEntity,
  ): Promise<ModerationRequestDetails> {
    const reviewerUserCode = request.reviewedByUserCode;

    if (
      request.status !== ModerationRequestStatus.APPROVED ||
      !reviewerUserCode
    ) {
      throw new AppHttpException(CatalisaCodes.INVALID_PERSISTENCE_DATA);
    }

    return sequelize.transaction(async (transaction) => {
      await ensureModerationTargetCanBeRemoved(
        request.targetType,
        request.targetId,
        transaction,
      );

      const pendingRequest = await ModerationRequestModel.findOne({
        where: {
          status: ModerationRequestStatus.PENDING,
          ...moderationTargetWhere(request.targetType, request.targetId),
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (pendingRequest) {
        throw new AppHttpException(
          CatalisaCodes.MODERATION_REQUEST_ALREADY_PENDING,
        );
      }

      const model = await ModerationRequestModel.create(
        ModerationRequestMapper.toPersistence(request),
        { transaction },
      );

      await removeModerationTarget(model, reviewerUserCode, transaction);

      return this.toDetails(model, transaction);
    });
  }

  async findAll(
    status?: ModerationRequestStatus,
  ): Promise<ModerationRequestDetails[]> {
    const requests = await ModerationRequestModel.findAll({
      ...(status ? { where: { status } } : {}),
      include: moderationUserIncludes,
      order: [['createdAt', 'DESC']],
    });

    return requests.map(ModerationRequestMapper.toDetails);
  }

  async review(
    input: ReviewModerationRequestInput,
  ): Promise<ModerationRequestDetails> {
    return sequelize.transaction(async (transaction) => {
      const request = await ModerationRequestModel.findByPk(input.requestId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!request) {
        throw new AppHttpException(CatalisaCodes.MODERATION_REQUEST_NOT_FOUND);
      }

      if (request.status !== ModerationRequestStatus.PENDING) {
        throw new AppHttpException(
          CatalisaCodes.MODERATION_REQUEST_ALREADY_REVIEWED,
        );
      }

      if (request.requestedByUserCode === input.reviewerUserCode) {
        throw new AppHttpException(CatalisaCodes.SELF_APPROVAL_NOT_ALLOWED);
      }

      if (input.decision === ModerationRequestStatus.APPROVED) {
        await removeModerationTarget(
          request,
          input.reviewerUserCode,
          transaction,
        );
      }

      request.status = input.decision;
      request.reviewedByUserCode = input.reviewerUserCode;
      request.reviewReason = input.reviewReason.trim();
      request.reviewedAt = new Date();
      await request.save({ transaction });

      return this.toDetails(request, transaction);
    });
  }

  private async toDetails(
    request: ModerationRequestModel,
    transaction: Transaction,
  ): Promise<ModerationRequestDetails> {
    await request.reload({
      include: moderationUserIncludes,
      transaction,
    });

    return ModerationRequestMapper.toDetails(request);
  }
}
