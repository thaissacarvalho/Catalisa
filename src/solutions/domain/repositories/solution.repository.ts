import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import { SolutionEntity } from '@app/solutions/domain/entities/solution.entity';
import { UpdateSolutionStatusInput } from '@app/solutions/domain/repositories/inputs/update-solution-status.input';

export const SOLUTION_REPOSITORY = 'SolutionRepository';

export interface SolutionRepository {
  create(solution: SolutionEntity): Promise<SolutionEntity>;
  findPublishedByChallenge(challengeId: string): Promise<SolutionDetails[]>;
  findPublishedById(solutionId: string): Promise<SolutionDetails | null>;
  findAllForAdmin(): Promise<SolutionDetails[]>;
  findById(solutionId: string): Promise<SolutionEntity | null>;
  updateStatus(data: UpdateSolutionStatusInput): Promise<SolutionEntity | null>;
}
