import { TargetType } from '@app/common/domain/enums/target-type.enum';

export type LikeTarget =
  | {
      type: TargetType.SOLUTION;
      solutionId: string;
    }
  | {
      type: TargetType.COMMENT;
      commentId: string;
    };
