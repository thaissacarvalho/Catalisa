import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import ChallengeModel from '@app/challenges/infrastructure/persistence/sequelize/models/challenge.model';

export class ChallengeMapper {
  static toDomain(model: ChallengeModel): ChallengeEntity {
    return new ChallengeEntity(
      model.id,
      model.title,
      model.description,
      model.status,
      model.createdAt,
      model.updatedAt,
    );
  }

  static toPersistence(challenge: ChallengeEntity) {
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      status: challenge.status,
      createdAt: challenge.createdAt,
      updatedAt: challenge.updatedAt,
    };
  }
}