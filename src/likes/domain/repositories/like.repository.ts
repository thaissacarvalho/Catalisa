export abstract class LikeRepository {
  abstract countVisibleBySolution(solutionId: string): Promise<number>;
}
