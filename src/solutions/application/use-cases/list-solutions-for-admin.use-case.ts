import { Inject, Injectable } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { ensureAdmin } from '@app/common/authorization/ensure-admin';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@Injectable()
export class ListSolutionsForAdminUseCase {
  constructor(
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
  ) {}

  async execute(actorRole: UserRole): Promise<SolutionDetails[]> {
    ensureAdmin(actorRole);
    const solution = await this.solutionRepository.findAllForAdmin();

    if (!solution || solution.length === 0) {
      throw new AppHttpException(CatalisaCodes.SOLUTION_NOT_FOUND);
    }

    return solution;
  }
}
