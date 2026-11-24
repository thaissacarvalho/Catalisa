import { Inject, Injectable } from '@nestjs/common';
import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';

@Injectable()
export class ListPublishedSolutionsUseCase {
  constructor(
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
    @Inject('ChallengeRepository')
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(challengeId: string): Promise<SolutionDetails[]> {
    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new AppHttpException(CatalisaCodes.CHALLENGE_NOT_FOUND);
    }

    const solution =
      await this.solutionRepository.findPublishedByChallenge(challengeId);

    return solution;
  }
}
