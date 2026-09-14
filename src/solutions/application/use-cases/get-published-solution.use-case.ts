import { Inject, Injectable } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import {
  SOLUTION_REPOSITORY,
  SolutionRepository,
} from '@app/solutions/domain/repositories/solution.repository';

@Injectable()
export class GetPublishedSolutionUseCase {
  constructor(
    @Inject(SOLUTION_REPOSITORY)
    private readonly solutionRepository: SolutionRepository,
  ) {}

  async execute(solutionId: string): Promise<SolutionDetails> {
    let solution: SolutionDetails | null;

    try {
      solution = await this.solutionRepository.findPublishedById(solutionId);
    } catch {
      throw new AppHttpException(TokenCodes.SOLUTION_QUERY_FAILED);
    }

    if (!solution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    return solution;
  }
}
