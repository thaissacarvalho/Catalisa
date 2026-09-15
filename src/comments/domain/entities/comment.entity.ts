import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';

export class CommentEntity {
  constructor(
    public readonly id: string,
    public solutionId: string,
    public userCode: string,
    public comment: string,
    public status: CommentStatus,
  ) {}
}