import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { Inject } from '@nestjs/common';

export class FindIdChallengeUseCase {
  constructor(
    @Inject('ChallengeRepository')
    private readonly challengeRepository: ChallengeRepository
  ) {}

  async execute(id: string): Promise<ChallengeEntity | null> {
    return this.challengeRepository.findById(id);
  }
}