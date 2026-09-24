import { Inject, Injectable } from '@nestjs/common';
import { LikeTarget, LikeType } from '@app/likes/domain/enums/like-type.enum';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';

@Injectable()
export class EnsureLikeTargetVisibleUseCase {
  constructor(
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(target: LikeTarget): Promise<void> {
    if (target.type === LikeType.SOLUTION) {
      const solution = await this.solutionRepository.findPublishedById(
        target.solutionId,
      );

      if (!solution) {
        throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
      }
    } else if (target.type === LikeType.COMMENT) {
      const comment = await this.commentRepository.find(target.commentId);

      if (!comment) {
        throw new AppHttpException(TokenCodes.COMMENT_NOT_FOUND);
      }
    } else {
      throw new AppHttpException(TokenCodes.INVALID_REQUEST);
    }
  }
}
