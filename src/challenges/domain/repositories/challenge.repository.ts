import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';

export const CHALLENGE_REPOSITORY = 'ChallengeRepository';

export interface ChallengeRepository {
  findAllActive(): Promise<ChallengeEntity[]>;
  findById(challengeId: string): Promise<ChallengeEntity | null>;
  existsActiveById(challengeId: string): Promise<boolean>;
  updateStatus(
    challengeId: string,
    status: ChallengeStatus,
  ): Promise<ChallengeEntity | null>;
}
