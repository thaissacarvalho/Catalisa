import { Inject, Injectable } from '@nestjs/common';
import {
  ChallengeRepository,
} from '@app/challenges/domain/repositories/challenge.repository';
import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';

@Injectable()
export class UpdateChallengeStatusUseCase {
  constructor(
    @Inject('ChallengeRepository')
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(
    challengeId: string,
    status: ChallengeStatus,
  ): Promise<ChallengeEntity> {
    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new AppHttpException(TokenCodes.CHALLENGE_NOT_FOUND);
    }

    if (challenge.status === status) {
      throw new AppHttpException(TokenCodes.CHALLENGE_STATUS_UNCHANGED);
    }

    const updatedChallenge = await this.challengeRepository.updateStatus(
      challengeId,
      status,
    );

    if (!updatedChallenge) {
      throw new AppHttpException(TokenCodes.CHALLENGE_NOT_FOUND);
    }

    return updatedChallenge;
  }
}
