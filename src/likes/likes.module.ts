import { UsersModule } from '@app/users/users.module';
import { CreateLikeController } from './application/controllers/create-like.controller';
import { DeleteLikeController } from './application/controllers/delete-like.controller';
import { CreateLikeUseCase } from './application/use-cases/create-like.use-case';
import { DeleteLikeUseCase } from './application/use-cases/delete-like.use-case';
import { EnsureLikeTargetVisibleUseCase } from './application/use-cases/ensure-like-target-visible.use-case';
import { Module } from '@nestjs/common';
import { SolutionsModule } from '@app/solutions/solutions.module';
import { SequelizeLikeRepository } from '@app/likes/infrastructure/persistence/sequelize/repositories/sequelize-like.repository';
import { CommentsModule } from '@app/comments/comments.module';
import { CountByLikeController } from '@app/likes/application/controllers/count-likes.controller';
import { CountByLikeUseCase } from '@app/likes/application/use-cases/count-by-like.use-case';

@Module({
  imports: [SolutionsModule, CommentsModule, UsersModule],
  controllers: [
    CountByLikeController,
    CreateLikeController,
    DeleteLikeController,
  ],
  providers: [
    CountByLikeUseCase,
    CreateLikeUseCase,
    DeleteLikeUseCase,
    EnsureLikeTargetVisibleUseCase,
    { provide: 'LikeRepository', useClass: SequelizeLikeRepository },
  ],
})
export class LikesModule {}
