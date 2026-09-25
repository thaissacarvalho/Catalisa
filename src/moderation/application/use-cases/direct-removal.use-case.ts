import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { ModerationRequestDetails } from '@app/moderation/domain/entities/moderation-request-details.entity';
import { ModerationRequestEntity } from '@app/moderation/domain/entities/moderation-request.entity';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { ModerationRepository } from '@app/moderation/domain/repositories/moderation.repository';

@Injectable()
export class DirectRemovalUseCase {
  constructor(
    @Inject('ModerationRepository')
    private readonly moderationRepository: ModerationRepository,
  ) {}

  execute(
    targetType: TargetType,
    targetId: string,
    reason: string,
    actorUserCode: string,
  ): Promise<ModerationRequestDetails> {
    const now = new Date();
    const normalizedReason = reason.trim();
    const request = new ModerationRequestEntity(
      randomUUID(),
      targetType,
      targetId,
      ModerationRequestStatus.APPROVED,
      normalizedReason,
      actorUserCode,
      actorUserCode,
      normalizedReason,
      now,
      now,
      now,
    );

    return this.moderationRepository.removeDirect(request);
  }
}
