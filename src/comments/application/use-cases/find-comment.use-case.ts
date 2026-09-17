import { Inject } from '@nestjs/common';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { UserRepository } from '@app/users/domain/repositories/user.repository';

export class FindCommentUseCase {
  constructor(
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
    private readonly solutionRepository: SolutionRepository,
    private readonly userRepository: UserRepository
  ) { }

  async execute(id: string): Promise<CommentEntity | null> {
    const comment = await this.commentRepository.find(id);

    if (!comment) {
      return null;
    }

    const solutionExist = await this.solutionRepository.findById(comment.solutionId);

    if (!solutionExist) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    const userExist = await this.userRepository.findById(comment.userCode);

    if (!userExist) {
      throw new AppHttpException(TokenCodes.USER_NOT_FOUND);
    }

    return comment;
  }
}