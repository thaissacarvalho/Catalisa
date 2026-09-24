export enum LikeType {
  COMMENT = 'COMMENT',
  SOLUTION = 'SOLUTION',
}

export type LikeTarget =
  | {
    type: LikeType.SOLUTION;
    solutionId: string;
  }
  | {
    type: LikeType.COMMENT;
    commentId: string;
  };