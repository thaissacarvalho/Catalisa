import { SolutionEntity } from '@app/solutions/domain/entities/solution.entity';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

export interface SolutionAuthor {
  userCode: string;
  name: string;
  jobPosition: string;
  enterprise: string;
}

export interface SolutionModerator {
  userCode: string;
  name: string;
  role: UserRole;
}

export interface SolutionDetails {
  solution: SolutionEntity;
  author: SolutionAuthor;
  moderator: SolutionModerator | null;
}
