import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { Inject } from '@nestjs/common';

export class ExistsByIdChallengeUseCase {
  constructor(
    @Inject('ChallengeRepository')
    private readonly challengeRepository: ChallengeRepository
  ) {}

  async execute(challengeId: string): Promise<boolean> {
    return this.challengeRepository.existsById(challengeId);
  }
}