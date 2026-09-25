import { Inject, Injectable } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionEntity } from '@app/solutions/domain/entities/solution.entity';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import { SolutionRepository } from '@app/solutions/domain/repositories/solution.repository';
import { ensureAdmin } from '@app/common/authorization/ensure-admin';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { DirectRemovalUseCase } from '@app/moderation/application/use-cases/direct-removal.use-case';
import { TargetType } from '@app/common/domain/enums/target-type.enum';

@Injectable()
export class UpdateSolutionStatusUseCase {
  constructor(
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
    private readonly directRemovalUseCase: DirectRemovalUseCase,
  ) {}

  async execute(
    solutionId: string,
    status: SolutionStatus,
    moderatorUserCode: string,
    reason?: string,
    actorRole?: UserRole,
  ): Promise<SolutionEntity> {
    ensureAdmin(actorRole!); // Ensure the user has admin privileges before proceeding

    const solution = await this.solutionRepository.findById(solutionId);

    if (!solution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    if (solution.status === status) {
      throw new AppHttpException(TokenCodes.SOLUTION_STATUS_UNCHANGED);
    }

    if (
      status === SolutionStatus.REMOVED &&
      actorRole !== UserRole.SUPER_ADMIN
    ) {
      throw new AppHttpException(TokenCodes.REMOVAL_REQUIRES_APPROVAL);
    }

    if (status === SolutionStatus.REMOVED && !reason?.trim()) {
      throw new AppHttpException(
        TokenCodes.SOLUTION_MODERATION_REASON_REQUIRED,
      );
    }

    if (status === SolutionStatus.REMOVED) {
      await this.directRemovalUseCase.execute(
        TargetType.SOLUTION,
        solutionId,
        reason!,
        moderatorUserCode,
      );

      const removedSolution =
        await this.solutionRepository.findById(solutionId);
      if (!removedSolution) {
        throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
      }

      return removedSolution;
    }

    const updatedSolution = await this.solutionRepository.updateStatus({
      solutionId,
      status,
      moderationReason: null,
      moderatedByUserCode: null,
      moderatedAt: null,
    });

    if (!updatedSolution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    return updatedSolution;
  }
}
