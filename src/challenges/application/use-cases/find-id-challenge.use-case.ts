import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { TokenCodes } from '@app/common/http/token-codes';
import { Inject, Injectable } from '@nestjs/common';
@Injectable()
export class FindIdChallengeUseCase {
  constructor(
    @Inject('ChallengeRepository')
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(challengeId: number): Promise<ChallengeEntity> {
    const challenge = await this.challengeRepository.findById(challengeId);

    if (!challenge || challenge.status !== ChallengeStatus.ACTIVE) {
      throw new AppHttpException(TokenCodes.CHALLENGE_NOT_FOUND);
    }

    return challenge;
  }
}
