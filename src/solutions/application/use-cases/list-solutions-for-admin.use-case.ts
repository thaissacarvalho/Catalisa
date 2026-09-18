import { Inject, Injectable } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import {
  SolutionRepository,
} from '@app/solutions/domain/repositories/solution.repository';
import { UserRepository } from '@app/users/domain/repositories/user.repository';
import { ensureAdmin } from '@app/common/authorization/ensure-admin';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@Injectable()
export class ListSolutionsForAdminUseCase {
  constructor(
    @Inject('SolutionRepository')
    @Inject('UserRepository')
    private readonly solutionRepository: SolutionRepository,
    private readonly userRepository: UserRepository
  ) { }

  async execute(actorRole: UserRole): Promise<SolutionDetails[]> {
    ensureAdmin(actorRole);
    const solution = await this.solutionRepository.findAllForAdmin();

    if (!solution || solution.length === 0) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    return solution;
  }
}
