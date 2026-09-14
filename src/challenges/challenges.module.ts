import { Module } from '@nestjs/common';

import { ExistsByIdChallengeController } from './application/controllers/exists-by-id-challenge.controller';
import { CreateChallengeController } from './application/controllers/create-challenge.controller';
import { FindAllChallengeController } from './application/controllers/find-all-challenge.controller';
import { FindIdChallengeController } from './application/controllers/find-id-challenge.controller';
import { ExistsByIdChallengeUseCase } from './application/use-cases/exists-by-id-challenge.use-case';
import { CreateChallengeUseCase } from './application/use-cases/create-challenge.use-case';
import { FindAllChallengeUseCase } from './application/use-cases/find-all-challenge.use-case';
import { FindIdChallengeUseCase } from './application/use-cases/find-id-challenge.use-case';
import { SequelizeChallengeRepository } from '@app/challenges/infrastructure/persistence/sequelize/repositories/sequelize-challenge.repository';

@Module({
  controllers: [
    ExistsByIdChallengeController,
    CreateChallengeController,
    FindAllChallengeController,
    FindIdChallengeController,
  ],
  providers: [
    ExistsByIdChallengeUseCase,
    CreateChallengeUseCase,
    FindAllChallengeUseCase,
    FindIdChallengeUseCase,
    {
      provide: 'ChallengeRepository',
      useClass: SequelizeChallengeRepository,
    },
  ],
  exports: ['ChallengeRepository',],
})

export class ChallengesModule {}
