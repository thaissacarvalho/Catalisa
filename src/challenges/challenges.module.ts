import { Module } from '@nestjs/common';
import { FindAllChallengeController } from '@app/challenges/application/controllers/find-all-challenge.controller';
import { FindIdChallengeController } from '@app/challenges/application/controllers/find-id-challenge.controller';
import { UpdateChallengeStatusController } from '@app/challenges/application/controllers/update-challenge-status.controller';
import { FindAllChallengeUseCase } from '@app/challenges/application/use-cases/find-all-challenge.use-case';
import { FindIdChallengeUseCase } from '@app/challenges/application/use-cases/find-id-challenge.use-case';
import { UpdateChallengeStatusUseCase } from '@app/challenges/application/use-cases/update-challenge-status.use-case';
import { CHALLENGE_REPOSITORY } from '@app/challenges/domain/repositories/challenge.repository';
import { SequelizeChallengeRepository } from '@app/challenges/infrastructure/persistence/sequelize/repositories/sequelize-challenge.repository';

@Module({
  controllers: [
    FindAllChallengeController,
    FindIdChallengeController,
    UpdateChallengeStatusController,
  ],
  providers: [
    FindAllChallengeUseCase,
    FindIdChallengeUseCase,
    UpdateChallengeStatusUseCase,
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: SequelizeChallengeRepository,
    },
  ],
  exports: [CHALLENGE_REPOSITORY],
})
export class ChallengesModule {}
