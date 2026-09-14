import { TokenCodes } from '@app/common/http/token-codes';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChallengeUseCase } from '../use-cases/create-challenge.use-case';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { successResponse } from '@app/common/http/success-response';

@ApiTags('Challenges')
@Controller('challenges')
export class CreateChallengeController {
  constructor(private readonly createChallengeUseCase: CreateChallengeUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new challenge' })
  @ApiCreatedResponse({ description: 'Challenge created.' })
  async create(@Body() challengeData: CreateChallengeDto) {
    const challenge = await this.createChallengeUseCase.execute(challengeData);

    return successResponse(TokenCodes.CHALLENGE_CREATED, challenge);
  }
}