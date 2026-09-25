import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { TargetType } from '@app/common/domain/enums/target-type.enum';

export class ModerationRequestEntity {
  constructor(
    public readonly id: string,
    public readonly targetType: TargetType,
    public readonly targetId: string,
    public readonly status: ModerationRequestStatus,
    public readonly reason: string,
    public readonly requestedByUserCode: string,
    public readonly reviewedByUserCode: string | null,
    public readonly reviewReason: string | null,
    public readonly reviewedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
