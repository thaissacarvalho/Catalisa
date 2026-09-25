import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';

export function targetWhere(target: LikeTarget) {
  return target.type === TargetType.SOLUTION
    ? {
        type: target.type,
        solutionId: target.solutionId,
      }
    : {
        type: target.type,
        commentId: target.commentId,
      };
}
