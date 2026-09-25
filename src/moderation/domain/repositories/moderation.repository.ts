import { ModerationRequestDetails } from '@app/moderation/domain/entities/moderation-request-details.entity';
import { ModerationRequestEntity } from '@app/moderation/domain/entities/moderation-request.entity';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { ReviewModerationRequestInput } from '@app/moderation/domain/repositories/inputs/review-moderation-request.input';

export interface ModerationRepository {
  create(request: ModerationRequestEntity): Promise<ModerationRequestDetails>;
  removeDirect(
    request: ModerationRequestEntity,
  ): Promise<ModerationRequestDetails>;
  findAll(
    status?: ModerationRequestStatus,
  ): Promise<ModerationRequestDetails[]>;
  review(
    input: ReviewModerationRequestInput,
  ): Promise<ModerationRequestDetails>;
}
