import { Module } from '@nestjs/common';
import { ChallengesModule } from '@app/challenges/challenges.module';
import { CreateSolutionController } from '@app/solutions/application/controllers/create-solution.controller';
import { GetPublishedSolutionController } from '@app/solutions/application/controllers/get-published-solution.controller';
import { ListPublishedSolutionsController } from '@app/solutions/application/controllers/list-published-solutions.controller';
import { ListSolutionsForAdminController } from '@app/solutions/application/controllers/list-solutions-for-admin.controller';
import { UpdateSolutionStatusController } from '@app/solutions/application/controllers/update-solution-status.controller';
import { CreateSolutionUseCase } from '@app/solutions/application/use-cases/create-solution.use-case';
import { GetPublishedSolutionUseCase } from '@app/solutions/application/use-cases/get-published-solution.use-case';
import { ListPublishedSolutionsUseCase } from '@app/solutions/application/use-cases/list-published-solutions.use-case';
import { ListSolutionsForAdminUseCase } from '@app/solutions/application/use-cases/list-solutions-for-admin.use-case';
import { UpdateSolutionStatusUseCase } from '@app/solutions/application/use-cases/update-solution-status.use-case';
import { SequelizeSolutionRepository } from '@app/solutions/infrastructure/persistence/sequelize/repositories/sequelize-solution.repository';
import { UsersModule } from '@app/users/users.module';

@Module({
  imports: [UsersModule, ChallengesModule],
  controllers: [
    CreateSolutionController,
    GetPublishedSolutionController,
    ListPublishedSolutionsController,
    ListSolutionsForAdminController,
    UpdateSolutionStatusController,
  ],
  providers: [
    CreateSolutionUseCase,
    GetPublishedSolutionUseCase,
    ListPublishedSolutionsUseCase,
    ListSolutionsForAdminUseCase,
    UpdateSolutionStatusUseCase,
    {
      provide: 'SolutionRepository',
      useClass: SequelizeSolutionRepository,
    },
  ],
  exports: ['SolutionRepository'],
})
export class SolutionsModule {}
