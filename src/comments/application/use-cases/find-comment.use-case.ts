import { Inject } from '@nestjs/common';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';

export class FindCommentUseCase {
  constructor(
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
  ) {}

  async execute(id: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.find(id);

    if (!comment) {
      throw new AppHttpException(TokenCodes.COMMENT_NOT_FOUND);
    }

    const solutionExist = await this.solutionRepository.findPublishedById(
      comment.solutionId,
    );

    if (!solutionExist) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    return comment;
  }
}
