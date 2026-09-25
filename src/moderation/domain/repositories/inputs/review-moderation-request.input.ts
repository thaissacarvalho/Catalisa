import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';

export interface ReviewModerationRequestInput {
  requestId: string;
  decision: ModerationRequestStatus.APPROVED | ModerationRequestStatus.REJECTED;
  reviewerUserCode: string;
  reviewReason: string;
}
