import { LikeType, LikeTarget } from '@app/likes/domain/enums/like-type.enum';

interface PersistedLikeTarget {
  type: LikeType;
  solutionId: string | null;
  commentId: string | null;
}

export function toLikeTarget(data: PersistedLikeTarget): LikeTarget {
  switch (data.type) {
    case LikeType.SOLUTION:
      if (data.solutionId == null || data.commentId != null) {
        throw new Error('Invalid persisted solution like');
      }

      return {
        type: LikeType.SOLUTION,
        solutionId: data.solutionId,
      };

    case LikeType.COMMENT:
      if (data.commentId == null || data.solutionId != null) {
        throw new Error('Invalid persisted comment like');
      }

      return {
        type: LikeType.COMMENT,
        commentId: data.commentId,
      };

    default:
      throw new Error('Invalid persisted like type');
  }
}