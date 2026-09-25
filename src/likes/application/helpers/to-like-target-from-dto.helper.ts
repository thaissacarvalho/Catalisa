import { LikeTargetDto } from '@app/likes/application/dto/like-target.dto';
import { TargetType } from '@app/common/domain/enums/target-type.enum';
import { LikeTarget } from '@app/likes/domain/types/like-target.type';

export function toLikeTargetFromDto(data: LikeTargetDto): LikeTarget {
  return data.type === TargetType.SOLUTION
    ? {
        type: TargetType.SOLUTION,
        solutionId: data.targetId,
      }
    : {
        type: TargetType.COMMENT,
        commentId: data.targetId,
      };
}
