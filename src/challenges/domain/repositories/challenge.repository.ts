import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';

export const CHALLENGE_REPOSITORY = 'ChallengeRepository';

export interface ChallengeRepository {
  create(challenge: ChallengeEntity): Promise<ChallengeEntity>;
  findById(id: string): Promise<ChallengeEntity | null>;
  findAll(): Promise<ChallengeEntity[]>;
  existsById(challengeId: string): Promise<boolean>;
}
