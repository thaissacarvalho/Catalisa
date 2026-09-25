import { Inject, Injectable } from '@nestjs/common';
import { ensureAdmin } from '@app/common/authorization/ensure-admin';
import { ModerationRequestDetails } from '@app/moderation/domain/entities/moderation-request-details.entity';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { ModerationRepository } from '@app/moderation/domain/repositories/moderation.repository';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@Injectable()
export class ListRemovalRequestsUseCase {
  constructor(
    @Inject('ModerationRepository')
    private readonly moderationRepository: ModerationRepository,
  ) {}

  execute(
    actorRole: UserRole,
    status?: ModerationRequestStatus,
  ): Promise<ModerationRequestDetails[]> {
    ensureAdmin(actorRole);
    return this.moderationRepository.findAll(status);
  }
}
