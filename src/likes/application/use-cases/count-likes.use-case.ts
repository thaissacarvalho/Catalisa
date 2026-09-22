import { Inject, Injectable } from '@nestjs/common';
import { LikeRepository } from '@app/likes/domain/repositories/like.repository';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';

@Injectable()
export class CountLikesUseCase {
  constructor(
    @Inject('LikeRepository')
    private readonly likes: LikeRepository,
    @Inject('SolutionRepository')
    private readonly solutions: SolutionRepository,
  ) {}

  async execute(solutionId: string): Promise<{ count: number }> {
    const findSolution = await this.solutions.findPublishedById(solutionId);
    
    if (!findSolution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    const countLike = await this.likes.countVisibleBySolution(solutionId);

    return countLike;
  }
}
