import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';
import { CommentRepository } from '@app/comments/domain/repositories/comment.repository';
import { ensureAdmin } from '@app/common/authorization/ensure-admin';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { DirectRemovalUseCase } from '@app/moderation/application/use-cases/direct-removal.use-case';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { Inject } from '@nestjs/common';

export class UpdateCommentStatusUseCase {
  constructor(
    @Inject('CommentRepository')
    private readonly commentRepository: CommentRepository,
    private readonly directRemovalUseCase: DirectRemovalUseCase,
  ) {}

  async execute(
    id: string,
    status: CommentStatus,
    actorUserCode: string,
    actorRole: UserRole,
    reason?: string,
  ): Promise<CommentEntity> {
    ensureAdmin(actorRole);
    if (!Object.values(CommentStatus).includes(status)) {
      throw new AppHttpException(CatalisaCodes.INVALID_COMMENT);
    }

    if (status === CommentStatus.EXCLUDED) {
      if (actorRole !== UserRole.SUPER_ADMIN) {
        throw new AppHttpException(CatalisaCodes.REMOVAL_REQUIRES_APPROVAL);
      }
      if (!reason?.trim()) {
        throw new AppHttpException(
          CatalisaCodes.COMMENT_MODERATION_REASON_REQUIRED,
        );
      }
    }

    if (status === CommentStatus.EXCLUDED) {
      await this.directRemovalUseCase.execute(
        TargetType.COMMENT,
        id,
        reason!,
        actorUserCode,
      );

      const removedComment = await this.commentRepository.findById(id);
      if (!removedComment) {
        throw new AppHttpException(CatalisaCodes.COMMENT_NOT_FOUND);
      }

      return removedComment;
    }

    const comment = await this.commentRepository.updateStatus(id, status);

    if (!comment) {
      throw new AppHttpException(CatalisaCodes.COMMENT_NOT_FOUND);
    }

    return comment;
  }
}
