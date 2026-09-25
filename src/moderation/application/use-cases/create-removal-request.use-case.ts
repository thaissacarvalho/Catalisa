import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ensureAdmin } from '@app/common/authorization/ensure-admin';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { ModerationRequestDetails } from '@app/moderation/domain/entities/moderation-request-details.entity';
import { ModerationRequestEntity } from '@app/moderation/domain/entities/moderation-request.entity';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { ModerationRepository } from '@app/moderation/domain/repositories/moderation.repository';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@Injectable()
export class CreateRemovalRequestUseCase {
  constructor(
    @Inject('ModerationRepository')
    private readonly moderationRepository: ModerationRepository,
  ) {}

  execute(
    targetType: TargetType,
    targetId: string,
    reason: string,
    requesterUserCode: string,
    requesterRole: UserRole,
  ): Promise<ModerationRequestDetails> {
    ensureAdmin(requesterRole);

    const now = new Date();
    const request = new ModerationRequestEntity(
      randomUUID(),
      targetType,
      targetId,
      ModerationRequestStatus.PENDING,
      reason.trim(),
      requesterUserCode,
      null,
      null,
      null,
      now,
      now,
    );

    return this.moderationRepository.create(request);
  }
}
