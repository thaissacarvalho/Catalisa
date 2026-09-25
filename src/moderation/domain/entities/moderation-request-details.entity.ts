import { ModerationRequestEntity } from '@app/moderation/domain/entities/moderation-request.entity';

export interface ModerationActor {
  userCode: string;
  name: string;
  email: string;
}

export interface ModerationRequestDetails {
  request: ModerationRequestEntity;
  requestedBy: ModerationActor;
  reviewedBy: ModerationActor | null;
}
