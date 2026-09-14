import { TokenCodes } from '@app/common/http/token-codes';
import { Body, Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindIdChallengeUseCase } from '@app/challenges/application/use-cases/find-id-challenge.use-case';
import { successResponse } from '@app/common/http/success-response';

@ApiTags('Challenges')
@Controller('challenges')
export class FindIdChallengeController {
  constructor(private readonly findIdChallengeUseCase: FindIdChallengeUseCase) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find a challenge by ID' })
  @ApiCreatedResponse({ description: 'Challenge found.' })
  async find(@Body() ChallengeId: string) {
    const challenge = await this.findIdChallengeUseCase.execute(ChallengeId);

    return successResponse(TokenCodes.CHALLENGE_CREATED, challenge);
  }
}