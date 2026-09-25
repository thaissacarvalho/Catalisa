import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { Inject } from '@nestjs/common';
import { CreateCommentDto } from '@app/comments/application/dto/create-comment.dto';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';

export class CreateCommentUseCase {
  constructor(
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: CreateCommentDto): Promise<CommentEntity> {
    const text = typeof data.comment === 'string' ? data.comment.trim() : '';

    if (Array.from(text).length < 50 || Array.from(text).length > 280) {
      throw new AppHttpException(TokenCodes.INVALID_COMMENT);
    }

    const user = await this.userRepository.findByUserCode(data.userCode);

    if (!user) {
      throw new AppHttpException(TokenCodes.USER_NOT_FOUND);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppHttpException(TokenCodes.FORBIDDEN);
    }

    const solution = await this.solutionRepository.findPublishedById(
      data.solutionId,
    );

    if (!solution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    if (data.parentCommentId) {
      const parent = await this.commentRepository.find(data.parentCommentId);

      if (!parent || parent.solutionId !== data.solutionId) {
        throw new AppHttpException(TokenCodes.PARENT_COMMENT_NOT_FOUND);
      }
    }

    const comment = new CommentEntity(
      crypto.randomUUID(),
      data.solutionId,
      data.parentCommentId ?? null,
      data.userCode,
      text,
      CommentStatus.ACTIVE,
    );

    return this.commentRepository.create(comment);
  }
}
