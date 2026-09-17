import { Inject } from '@nestjs/common';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';

export class FindCommentBySolutionUseCase {
  constructor(
    @Inject('CommentRepository')
    private readonly solutionRepository: SolutionRepository,
    private readonly commentRepository: CommentRepository
  ) {}

  async execute(solutionId: string): Promise<CommentEntity[]> {
    const solution = await this.solutionRepository.findById(solutionId);

    if (!solution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    const comments = await this.commentRepository.findCommentBySolution(solutionId);

    return comments;
  }
}