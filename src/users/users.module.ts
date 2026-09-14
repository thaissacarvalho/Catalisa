import { Module } from '@nestjs/common';

import { CreateUserController } from '@app/users/application/controllers/create-user.controller';
import { GetUserByUserCodeController } from '@app/users/application/controllers/list-user-by-user-code.controller';
import { UpdateUserByStatusController } from '@app/users/application/controllers/update-user-by-status.controller';
import { SequelizeUserRepository } from '@app/users/infrastructure/persistence/sequelize/repositories/sequelize-user.repository';
import { CreateUserUseCase } from '@app/users/application/use-cases/create-user.use-case';
import { ListUserByUserCodeUseCase } from '@app/users/application/use-cases/list-user-by-user-code.use-case';
import { UpdateUserStatusUseCase } from '@app/users/application/use-cases/update-user-status.use-case';

@Module({
  controllers: [
    CreateUserController,
    GetUserByUserCodeController,
    UpdateUserByStatusController,
  ],
  providers: [
    CreateUserUseCase,
    ListUserByUserCodeUseCase,
    UpdateUserStatusUseCase,
    {
      provide: 'UserRepository',
      useClass: SequelizeUserRepository,
    },
  ],
  exports: ['UserRepository', UpdateUserStatusUseCase],
})

export class UsersModule {}
