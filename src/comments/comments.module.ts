import { SolutionsModule } from '@app/solutions/solutions.module';
import { UsersModule } from '@app/users/users.module';
import { Module } from '@nestjs/common';
import { CreateCommentController } from '@app/comments/application/controllers/create-comment.controller';
import { FindCommentController } from '@app/comments/application/controllers/find-comment.controller';
import { UpdateCommentStatusController } from '@app/comments/application/controllers/update-comment-status.controller';
import { SequelizeCommentRepository } from '@app/comments/infrastructure/persistence/sequelize/repositories/sequelize-comment.repository';
import { CreateCommentUseCase } from '@app/comments/application/use-cases/create-comment.use-case';
import { FindCommentUseCase } from '@app/comments/application/use-cases/find-comment.use-case';
import { UpdateCommentStatusUseCase } from '@app/comments/application/use-cases/update-comment-status.use-case';
import { FindCommentBySolutionController } from '@app/comments/application/controllers/find-comment-by-solution.controller';
import { FindCommentBySolutionUseCase } from '@app/comments/application/use-cases/find-comment-by-solution.use-case';

@Module({
  imports: [SolutionsModule, UsersModule],
  controllers: [
    CreateCommentController,
    FindCommentController,
    FindCommentBySolutionController,
    UpdateCommentStatusController,
  ],
  providers: [
    CreateCommentUseCase,
    FindCommentUseCase,
    FindCommentBySolutionUseCase,
    UpdateCommentStatusUseCase,
    {
      provide: 'CommentRepository',
      useClass: SequelizeCommentRepository,
    },
  ],
  exports: [
    'CommentRepository',
    CreateCommentUseCase,
    FindCommentUseCase,
    UpdateCommentStatusUseCase,
  ],
})
export class CommentsModule {}
