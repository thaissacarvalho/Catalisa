import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import ChallengeModel from '@app/challenges/infrastructure/persistence/sequelize/models/challenge.model';

export class ChallengeMapper {
  static toDomain(model: ChallengeModel): ChallengeEntity {
    return new ChallengeEntity(
      model.id,
      model.code,
      model.title,
      model.description,
      model.status,
      model.displayOrder,
      model.createdAt,
      model.updatedAt,
    );
  }

  static toPersistence(challenge: ChallengeEntity) {
    return {
      code: challenge.code,
      title: challenge.title,
      description: challenge.description,
      status: challenge.status,
      displayOrder: challenge.displayOrder,
      createdAt: challenge.createdAt,
      updatedAt: challenge.updatedAt,
    };
  }
}
