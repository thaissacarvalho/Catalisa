import { Inject, Injectable } from '@nestjs/common';
import { ensureAdmin } from '@app/common/authorization/ensure-admin';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { ModerationRequestDetails } from '@app/moderation/domain/entities/moderation-request-details.entity';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { ModerationRepository } from '@app/moderation/domain/repositories/moderation.repository';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@Injectable()
export class ReviewRemovalRequestUseCase {
  constructor(
    @Inject('ModerationRepository')
    private readonly moderationRepository: ModerationRepository,
  ) {}

  execute(
    requestId: string,
    decision:
      | ModerationRequestStatus.APPROVED
      | ModerationRequestStatus.REJECTED,
    reviewerUserCode: string,
    reviewerRole: UserRole,
    reason: string,
  ): Promise<ModerationRequestDetails> {
    ensureAdmin(reviewerRole);

    if (!reason.trim()) {
      throw new AppHttpException(CatalisaCodes.REVIEW_REASON_REQUIRED);
    }

    return this.moderationRepository.review({
      requestId,
      decision,
      reviewerUserCode,
      reviewReason: reason,
    });
  }
}
