import { Inject, Injectable } from '@nestjs/common';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionEntity } from '@app/solutions/domain/entities/solution.entity';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import {
  SOLUTION_REPOSITORY,
  SolutionRepository,
} from '@app/solutions/domain/repositories/solution.repository';

@Injectable()
export class UpdateSolutionStatusUseCase {
  constructor(
    @Inject(SOLUTION_REPOSITORY)
    private readonly solutionRepository: SolutionRepository,
  ) {}

  async execute(
    solutionId: string,
    status: SolutionStatus,
    moderatorUserCode: string,
    reason?: string,
  ): Promise<SolutionEntity> {
    const solution = await this.solutionRepository.findById(solutionId);

    if (!solution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    if (solution.status === status) {
      throw new AppHttpException(TokenCodes.SOLUTION_STATUS_UNCHANGED);
    }

    if (status === SolutionStatus.REMOVED && !reason?.trim()) {
      throw new AppHttpException(
        TokenCodes.SOLUTION_MODERATION_REASON_REQUIRED,
      );
    }

    const updatedSolution = await this.solutionRepository.updateStatus({
      solutionId,
      status,
      moderationReason:
        status === SolutionStatus.REMOVED ? reason!.trim() : null,
      moderatedByUserCode:
        status === SolutionStatus.REMOVED ? moderatorUserCode : null,
      moderatedAt: status === SolutionStatus.REMOVED ? new Date() : null,
    });

    if (!updatedSolution) {
      throw new AppHttpException(TokenCodes.SOLUTION_NOT_FOUND);
    }

    return updatedSolution;
  }
}
