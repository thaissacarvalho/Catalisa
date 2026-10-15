import { Injectable } from '@nestjs/common';
import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import ChallengeModel from '@app/challenges/infrastructure/persistence/sequelize/models/challenge.model';
import { ChallengeMapper } from '@app/challenges/infrastructure/persistence/sequelize/mappers/challenge.mapper';
import { ChallengeStatus } from '@app/challenges/domain/enums/ChallengeStatus.enum';

@Injectable()
export class SequelizeChallengeRepository implements ChallengeRepository {
  async findAllActive(): Promise<ChallengeEntity[]> {
    const challenges = await ChallengeModel.findAll({
      where: { status: ChallengeStatus.ACTIVE },
      order: [['displayOrder', 'ASC']],
    });

    return challenges.map(ChallengeMapper.toDomain);
  }

  async findById(challengeId: string): Promise<ChallengeEntity | null> {
    const challenge = await ChallengeModel.findByPk(challengeId);
    return challenge ? ChallengeMapper.toDomain(challenge) : null;
  }

  async existsActiveById(challengeId: string): Promise<boolean> {
    const total = await ChallengeModel.count({
      where: { id: challengeId, status: ChallengeStatus.ACTIVE },
    });

    return total > 0;
  }

  async updateStatus(
    challengeId: string,
    status: ChallengeStatus,
  ): Promise<ChallengeEntity | null> {
    const challenge = await ChallengeModel.findByPk(challengeId);

    if (!challenge) {
      return null;
    }

    challenge.status = status;
    await challenge.save();

    return ChallengeMapper.toDomain(challenge);
  }
}
