import { Injectable } from '@nestjs/common';
import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import ChallengeModel from '@app/challenges/infrastructure/persistence/sequelize/models/challenge.model';
import { ChallengeMapper } from '@app/challenges/infrastructure/persistence/sequelize/mappers/challenge.mapper';

@Injectable()
export class SequelizeChallengeRepository implements ChallengeRepository {
  async create(challenge: ChallengeEntity): Promise<ChallengeEntity> {
    const model = await ChallengeModel.create(ChallengeMapper.toPersistence(challenge));

    return ChallengeMapper.toDomain(model);
  }

  async findById(id: string): Promise<ChallengeEntity | null> {
    const challenge = await ChallengeModel.findByPk(id);

    return challenge ? ChallengeMapper.toDomain(challenge) : null;
  }

  async findAll(): Promise<ChallengeEntity[]> {
    const challenges = await ChallengeModel.findAll();

    return challenges.map(ChallengeMapper.toDomain);
  }

  async existsById(challengeId: string): Promise<boolean> {
    return (await ChallengeModel.count(
      {
        where: { id: challengeId }
      })) > 0;
  }
}
