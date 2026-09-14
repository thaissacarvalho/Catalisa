import { Inject, Injectable } from '@nestjs/common';
import {
  CHALLENGE_REPOSITORY,
  ChallengeRepository,
} from '@app/challenges/domain/repositories/challenge.repository';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import {
  SOLUTION_REPOSITORY,
  SolutionRepository,
} from '@app/solutions/domain/repositories/solution.repository';

@Injectable()
export class ListPublishedSolutionsUseCase {
  constructor(
    @Inject(SOLUTION_REPOSITORY)
    private readonly solutionRepository: SolutionRepository,
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(challengeId: number): Promise<SolutionDetails[]> {
    if (!(await this.challengeRepository.findById(challengeId))) {
      throw new AppHttpException(TokenCodes.CHALLENGE_NOT_FOUND);
    }

    try {
      return await this.solutionRepository.findPublishedByChallenge(
        challengeId,
      );
    } catch {
      throw new AppHttpException(TokenCodes.SOLUTION_QUERY_FAILED);
    }
  }
}
