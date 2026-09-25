import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';

export interface UpdateSolutionStatusInput {
  solutionId: string;
  status: SolutionStatus;
  moderationReason: string | null;
  moderatedByUserCode: string | null;
  moderatedAt: Date | null;
}
