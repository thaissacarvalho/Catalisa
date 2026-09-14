import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { CreateChallengeDto } from '@app/challenges/application/dto/create-challenge.dto';
import { Inject } from '@nestjs/common';
import { ChallengeEntity } from '@app/challenges/domain/entities/challenge.entity';

export class CreateChallengeUseCase {
  constructor(
    @Inject('ChallengeRepository') private readonly challengeRepository: ChallengeRepository
  ) {}

  async execute(data: CreateChallengeDto): Promise<CreateChallengeDto> {    
    return this.challengeRepository.create(
      new ChallengeEntity(
        crypto.randomUUID(),
        data.title.trim(),
        data.description.trim(),
        data.status,
        data.displayOrder,
        new Date(),
        new Date()
      )
    );
  }
}