import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';
import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { Inject, Injectable } from '@nestjs/common';
@Injectable()
export class FindAllChallengeUseCase {
  constructor(
    @Inject('ChallengeRepository')
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(): Promise<ChallengeEntity[]> {
    return this.challengeRepository.findAllActive();
  }
}
