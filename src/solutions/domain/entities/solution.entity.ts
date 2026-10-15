import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';

export class SolutionEntity {
  constructor(
    public readonly id: string,
    public readonly userCode: string,
    public readonly challengeId: string,
    public title: string,
    public description: string,
    public status: SolutionStatus,
    public moderationReason: string | null,
    public moderatedByUserCode: string | null,
    public moderatedAt: Date | null,
    public readonly createdAt: Date | null = null,
    public readonly updatedAt: Date | null = null,
  ) {}
}
