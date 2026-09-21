import { Module } from '@nestjs/common';
import { SolutionsModule } from '@app/solutions/solutions.module';
import { CountLikesController } from '@app/likes/application/controllers/count-likes.controller';
import { CountLikesUseCase } from '@app/likes/application/use-cases/count-likes.use-case';
import { LikeRepository } from '@app/likes/domain/repositories/like.repository';
import { SequelizeLikeRepository } from '@app/likes/infrastructure/persistence/sequelize/repositories/sequelize-like.repository';

@Module({
  imports: [SolutionsModule],
  controllers: [CountLikesController],
  providers: [
    CountLikesUseCase,
    { provide: LikeRepository, useClass: SequelizeLikeRepository },
  ],
})
export class LikesModule {}
