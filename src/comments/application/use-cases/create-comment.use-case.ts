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
    @Inject('CommentRepository')
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
    private readonly commentRepository: CommentRepository,
  ) { }

  async execute(data: CreateCommentDto): Promise<CommentEntity> {
    const solution = await this.solutionRepository.findById(data.solutionId);

    if (!solution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    const comment = new CommentEntity(
      crypto.randomUUID(),
      data.solutionId,
      data.userCode,
      data.comment,
      CommentStatus.ACTIVE, // Assuming the initial status is 'ACTIVE'
    );

    return this.commentRepository.create(comment);
  }
}