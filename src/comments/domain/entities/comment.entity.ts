import { CommentStatus } from '@app/comments/domain/enums/comment-status.enum';

export class CommentEntity {
  constructor(
    public readonly id: string,
    public solutionId: string,
    public userCode: string,
    public comment: string,
    public status: CommentStatus,
    public readonly createdAt: Date | null = null,
    public readonly updatedAt: Date | null = null,
    public readonly author: {
      userCode: string;
      name: string;
      jobPosition: string;
      enterprise: string;
    } | null = null,
  ) {}
}
