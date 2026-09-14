import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChallengeIdParamDto } from '@app/challenges/application/dto/challenge-id-param.dto';
import { ChallengePresenter } from '@app/challenges/application/presenters/challenge.presenter';
import { FindIdChallengeUseCase } from '@app/challenges/application/use-cases/find-id-challenge.use-case';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';

@ApiTags('Challenges')
@Controller('challenges')
export class FindIdChallengeController {
  constructor(
    private readonly findIdChallengeUseCase: FindIdChallengeUseCase,
  ) {}

  @Get(':challengeId')
  @ApiOperation({ summary: 'Get an active challenge by ID' })
  @ApiOkResponse({ description: 'Challenge found.' })
  async find(@Param() params: ChallengeIdParamDto) {
    const challenge = await this.findIdChallengeUseCase.execute(
      params.challengeId,
    );

    return successResponse(
      TokenCodes.CHALLENGE_FOUND,
      ChallengePresenter.public(challenge),
    );
  }
}
