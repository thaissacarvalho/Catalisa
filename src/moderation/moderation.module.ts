import { Module } from '@nestjs/common';
import { ApproveRemovalRequestController } from '@app/moderation/application/controllers/approve-removal-request.controller';
import { CreateRemovalRequestController } from '@app/moderation/application/controllers/create-removal-request.controller';
import { ListRemovalRequestsController } from '@app/moderation/application/controllers/list-removal-requests.controller';
import { RejectRemovalRequestController } from '@app/moderation/application/controllers/reject-removal-request.controller';
import { CreateRemovalRequestUseCase } from '@app/moderation/application/use-cases/create-removal-request.use-case';
import { DirectRemovalUseCase } from '@app/moderation/application/use-cases/direct-removal.use-case';
import { ListRemovalRequestsUseCase } from '@app/moderation/application/use-cases/list-removal-requests.use-case';
import { ReviewRemovalRequestUseCase } from '@app/moderation/application/use-cases/review-removal-request.use-case';
import { SequelizeModerationRepository } from '@app/moderation/infrastructure/persistence/sequelize/repositories/sequelize-moderation.repository';

@Module({
  controllers: [
    CreateRemovalRequestController,
    ListRemovalRequestsController,
    ApproveRemovalRequestController,
    RejectRemovalRequestController,
  ],
  providers: [
    CreateRemovalRequestUseCase,
    DirectRemovalUseCase,
    ListRemovalRequestsUseCase,
    ReviewRemovalRequestUseCase,
    {
      provide: 'ModerationRepository',
      useClass: SequelizeModerationRepository,
    },
  ],
  exports: [DirectRemovalUseCase],
})
export class ModerationModule {}
