import { LikeTarget, LikeType } from '@app/likes/domain/enums/like-type.enum';

export function targetWhere(target: LikeTarget) {
  return target.type === LikeType.SOLUTION
    ? {
      type: target.type,
      solutionId: target.solutionId,
    }
    : {
      type: target.type,
      commentId: target.commentId,
    };
}