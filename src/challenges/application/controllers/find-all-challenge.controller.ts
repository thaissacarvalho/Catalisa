import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllChallengeUseCase } from '@app/challenges/application/use-cases/find-all-challenge.use-case';
import { ChallengePresenter } from '@app/challenges/application/presenters/challenge.presenter';
import { successResponse } from '@app/common/http/success-response';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';

@ApiTags('Challenges')
@Controller('challenges')
export class FindAllChallengeController {
  constructor(
    private readonly findAllChallengeUseCase: FindAllChallengeUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List active challenges' })
  @ApiOkResponse({ description: 'Challenges listed.' })
  async findAll() {
    const challenges = await this.findAllChallengeUseCase.execute();

    return successResponse(
      CatalisaCodes.CHALLENGES_LISTED,
      challenges.map((challenge) => ChallengePresenter.public(challenge)),
    );
  }
}
