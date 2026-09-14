import { SolutionDetails } from '@app/solutions/domain/entities/solution-details.entity';
import { SolutionEntity } from '@app/solutions/domain/entities/solution.entity';
import SolutionModel from '@app/solutions/infrastructure/persistence/sequelize/models/solution.model';

export class SolutionMapper {
  static toDomain(model: SolutionModel): SolutionEntity {
    return new SolutionEntity(
      model.id,
      model.userCode,
      model.challengeId,
      model.title,
      model.description,
      model.status,
      model.moderationReason,
      model.moderatedByUserCode,
      model.moderatedAt,
      model.createdAt,
      model.updatedAt,
    );
  }

  static toDetails(model: SolutionModel): SolutionDetails {
    return {
      solution: this.toDomain(model),
      author: {
        userCode: model.author.userCode,
        name: model.author.name,
        jobPosition: model.author.jobPosition,
        enterprise: model.author.enterprise,
      },
      moderator: model.moderator
        ? {
            userCode: model.moderator.userCode,
            name: model.moderator.name,
            role: model.moderator.role,
          }
        : null,
    };
  }

  static toPersistence(solution: SolutionEntity) {
    return {
      id: solution.id,
      userCode: solution.userCode,
      challengeId: solution.challengeId,
      title: solution.title,
      description: solution.description,
      status: solution.status,
      moderationReason: solution.moderationReason,
      moderatedByUserCode: solution.moderatedByUserCode,
      moderatedAt: solution.moderatedAt,
    };
  }
}
