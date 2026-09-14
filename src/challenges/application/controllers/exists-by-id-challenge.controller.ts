import { ChallengeRepository } from '@app/challenges/domain/repositories/challenge.repository';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Challenges')
@Controller('challenges')
export class ExistsByIdChallengeController {
  constructor(
    private readonly challengeRepository: ChallengeRepository
  ) {}

  @Get(':id/exists')
  @ApiOperation({ summary: 'Check if a challenge exists by ID' })
  @ApiOkResponse({ description: 'Challenge existence checked.' })
  async existsById(id: string): Promise<boolean> {
    const challenge = await this.challengeRepository.findById(id);
    return !!challenge; // Return true if the challenge exists, false otherwise
  }
}