import { Inject, Injectable } from '@nestjs/common';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';

@Injectable()
export class EnsureLikeTargetVisibleUseCase {
  constructor(
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(target: LikeTarget): Promise<void> {
    if (target.type === TargetType.SOLUTION) {
      const solution = await this.solutionRepository.findPublishedById(
        target.solutionId,
      );

      if (!solution) {
        throw new AppHttpException(CatalisaCodes.SOLUTION_NOT_FOUND);
      }
    } else if (target.type === TargetType.COMMENT) {
      const comment = await this.commentRepository.find(target.commentId);

      if (!comment) {
        throw new AppHttpException(CatalisaCodes.COMMENT_NOT_FOUND);
      }
    } else {
      throw new AppHttpException(CatalisaCodes.INVALID_REQUEST);
    }
  }
}
