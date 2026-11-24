import { Inject, Injectable } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';

@Injectable()
export class ListPublishedSolutionUseCase {
  constructor(
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
  ) {}

  async execute(solutionId: string): Promise<SolutionDetails> {
    let solution: SolutionDetails | null;

    try {
      solution = await this.solutionRepository.findPublishedById(solutionId);
    } catch {
      throw new AppHttpException(CatalisaCodes.SOLUTION_QUERY_FAILED);
    }

    if (!solution) {
      throw new AppHttpException(CatalisaCodes.SOLUTION_NOT_FOUND);
    }

    return solution;
  }
}
