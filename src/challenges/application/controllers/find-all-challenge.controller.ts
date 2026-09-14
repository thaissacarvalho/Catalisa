import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAllChallengeUseCase } from '../use-cases/find-all-challenge.use-case';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';

@ApiTags('Challenges')
@Controller('challenges')
export class FindAllChallengeController {
  constructor(private readonly findAllChallengeUseCase: FindAllChallengeUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all challenges' })
  @ApiCreatedResponse({ description: 'Challenges found.' })
  async findAll() {
    const challenges = await this.findAllChallengeUseCase.execute();

    return successResponse(TokenCodes.CHALLENGES_LISTED, challenges);
  }
}