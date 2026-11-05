import { Inject } from '@nestjs/common';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';

export class FindCommentBySolutionUseCase {
  constructor(
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
  ) {}

  async execute(solutionId: string): Promise<CommentEntity[]> {
    const solution =
      await this.solutionRepository.findPublishedById(solutionId);

    if (!solution) {
      throw new AppHttpException(CatalisaCodes.SOLUTION_NOT_FOUND);
    }

    const comments =
      await this.commentRepository.findCommentBySolution(solutionId);

    return comments;
  }
}
