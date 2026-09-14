import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';

export class ChallengePresenter {
  static public(challenge: ChallengeEntity) {
    return {
      id: challenge.id,
      code: challenge.code,
      title: challenge.title,
      description: challenge.description,
      status: challenge.status,
      displayOrder: challenge.displayOrder,
    };
  }

  static statusUpdated(challenge: ChallengeEntity) {
    return {
      id: challenge.id,
      code: challenge.code,
      status: challenge.status,
      updatedAt: challenge.updatedAt,
    };
  }
}
