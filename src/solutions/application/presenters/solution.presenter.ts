import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import { SolutionEntity } from '@app/solutions/domain/entities/solution.entity';
import { SolutionStatus } from '@app/solutions/domain/enums/solution-status.enum';

export class SolutionPresenter {
  static created(solution: SolutionEntity) {
    return {
      id: solution.id,
      userCode: solution.userCode,
      challengeId: solution.challengeId,
      title: solution.title,
      description: solution.description,
      status: solution.status,
      createdAt: solution.createdAt,
    };
  }

  static public(details: SolutionDetails) {
    const { solution, author } = details;

    return {
      id: solution.id,
      challengeId: solution.challengeId,
      title: solution.title,
      description: solution.description,
      status: solution.status,
      createdAt: solution.createdAt,
      author,
    };
  }

  static admin(details: SolutionDetails) {
    const { solution, author, moderator } = details;

    return {
      id: solution.id,
      challengeId: solution.challengeId,
      title: solution.title,
      description: solution.description,
      status: solution.status,
      createdAt: solution.createdAt,
      updatedAt: solution.updatedAt,
      author,
      moderation:
        solution.status === SolutionStatus.REMOVED
          ? {
              reason: solution.moderationReason,
              moderatedAt: solution.moderatedAt,
              moderator,
            }
          : null,
    };
  }

  static statusUpdated(solution: SolutionEntity) {
    return {
      id: solution.id,
      status: solution.status,
      moderation:
        solution.status === SolutionStatus.REMOVED
          ? {
              reason: solution.moderationReason,
              moderatedAt: solution.moderatedAt,
              moderatedByUserCode: solution.moderatedByUserCode,
            }
          : null,
    };
  }
}
