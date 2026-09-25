import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';

interface PersistedLikeTarget {
  type: TargetType;
  solutionId: string | null;
  commentId: string | null;
}

export function toLikeTarget(data: PersistedLikeTarget): LikeTarget {
  switch (data.type) {
    case TargetType.SOLUTION:
      if (data.solutionId == null || data.commentId != null) {
        throw new Error('Invalid persisted solution like');
      }

      return {
        type: TargetType.SOLUTION,
        solutionId: data.solutionId,
      };

    case TargetType.COMMENT:
      if (data.commentId == null || data.solutionId != null) {
        throw new Error('Invalid persisted comment like');
      }

      return {
        type: TargetType.COMMENT,
        commentId: data.commentId,
      };

    default:
      throw new Error('Invalid persisted like type');
  }
}
