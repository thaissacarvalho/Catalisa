import { Inject, Injectable } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import {
  SOLUTION_REPOSITORY,
  SolutionRepository,
} from '@app/solutions/domain/repositories/solution.repository';

@Injectable()
export class ListSolutionsForAdminUseCase {
  constructor(
    @Inject(SOLUTION_REPOSITORY)
    private readonly solutionRepository: SolutionRepository,
  ) {}

  async execute(): Promise<SolutionDetails[]> {
    try {
      return await this.solutionRepository.findAllForAdmin();
    } catch {
      throw new AppHttpException(TokenCodes.SOLUTION_QUERY_FAILED);
    }
  }
}
