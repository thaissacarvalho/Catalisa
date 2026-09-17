import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { Inject } from '@nestjs/common';

export class UpdateCommentStatusUseCase {
  constructor(
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
  ) {}

  async execute(id: string, status: CommentStatus): Promise<CommentEntity> {
    const comment = await this.commentRepository.updateStatus(id, status);

    if (!comment) {
      throw new AppHttpException(TokenCodes.COMMENT_NOT_FOUND);
    }

    return comment;
  }
}