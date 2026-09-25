import { CommentEntity } from '@app/comments/domain/entities/comment.entity';
import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';

export interface CommentRepository {
  create(comment: CommentEntity): Promise<CommentEntity>;
  find(id: string): Promise<CommentEntity | null>;
  findById(id: string): Promise<CommentEntity | null>;
  findCommentBySolution(solutionId: string): Promise<CommentEntity[]>;
  updateStatus(
    id: string,
    status: CommentStatus,
    moderatedByUserCode?: string,
    moderationReason?: string,
  ): Promise<CommentEntity | null>;
}
