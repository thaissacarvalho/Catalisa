import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';
import { CreateSolutionDto } from '@app/solutions/application/dto/create-solution.dto';
import { SolutionPresenter } from '@app/solutions/application/presenters/solution.presenter';
import { CreateSolutionUseCase } from '@app/solutions/application/use-cases/create-solution.use-case';

@ApiTags('Solutions')
@Controller('solutions')
export class CreateSolutionController {
  constructor(private readonly createSolutionUseCase: CreateSolutionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a published solution' })
  @ApiCreatedResponse({ description: 'Solution created.' })
  async create(@Body() data: CreateSolutionDto) {
    const solution = await this.createSolutionUseCase.execute(data);

    return successResponse(
      TokenCodes.SOLUTION_CREATED,
      SolutionPresenter.created(solution),
    );
  }
}
