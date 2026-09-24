import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import {
  ChallengeRepository,
} from '@app/challenges/domain/repositories/challenge.repository';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { CreateSolutionInput } from '@app/solutions/application/contracts/create-solution-input.contract';
import { ensureCanPublishSolution } from '@app/common/authorization/ensure-can-publish-solution';
import { SolutionEntity } from '@app/solutions/domain/entities/solution.entity';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';
import {
  SolutionRepository,
} from '@app/solutions/domain/repositories/solution.repository';
import { UserStatus } from '@app/users/domain/enums/user-status.enum';
import { UserRepository } from '@app/users/domain/repositories/user.repository';

@Injectable()
export class CreateSolutionUseCase {
  constructor(
    @Inject('SolutionRepository')
    private readonly solutionRepository: SolutionRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ChallengeRepository')
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(data: CreateSolutionInput): Promise<SolutionEntity> {
    const user = await this.userRepository.findByUserCode(data.userCode);

    if (!user) {
      throw new AppHttpException(TokenCodes.INVALID_USER);
    }

    ensureCanPublishSolution(user.role);

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppHttpException(TokenCodes.INVALID_USER);
    }

    const challengeExist = await this.challengeRepository.existsActiveById(data.challengeId);

    if (!challengeExist) {
      throw new AppHttpException(TokenCodes.CHALLENGE_NOT_FOUND);
    }

    try {
      return await this.solutionRepository.create(
        new SolutionEntity(
          randomUUID(),
          data.userCode,
          data.challengeId,
          data.title.trim(),
          data.description.trim(),
          SolutionStatus.PUBLISHED,
          null,
          null,
          null,
        ),
      );
    } catch {
      throw new AppHttpException(TokenCodes.SOLUTION_CREATION_FAILED);
    }
  }
}
