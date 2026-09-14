import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';

export const CHALLENGE_REPOSITORY = 'ChallengeRepository';

export interface ChallengeRepository {
  findAllActive(): Promise<ChallengeEntity[]>;
  findById(challengeId: number): Promise<ChallengeEntity | null>;
  existsActiveById(challengeId: number): Promise<boolean>;
  updateStatus(
    challengeId: number,
    status: ChallengeStatus,
  ): Promise<ChallengeEntity | null>;
}
