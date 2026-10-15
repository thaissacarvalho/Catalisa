import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';

export class ChallengeEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public title: string,
    public description: string,
    public status: ChallengeStatus,
    public displayOrder: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
