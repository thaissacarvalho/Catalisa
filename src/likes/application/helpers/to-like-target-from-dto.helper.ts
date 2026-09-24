import { LikeTargetDto } from '@app/likes/application/dto/like-target.dto';
import { LikeTarget, LikeType } from '@app/likes/domain/enums/like-type.enum';

export function toLikeTargetFromDto(data: LikeTargetDto): LikeTarget {
  return data.type === LikeType.SOLUTION
    ? {
        type: LikeType.SOLUTION,
        solutionId: data.targetId,
      }
    : {
        type: LikeType.COMMENT,
        commentId: data.targetId,
      };
}
