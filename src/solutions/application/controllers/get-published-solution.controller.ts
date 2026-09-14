import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionIdParamDto } from '@app/solutions/application/dto/solution-id-param.dto';
import { SolutionPresenter } from '@app/solutions/application/presenters/solution.presenter';
import { GetPublishedSolutionUseCase } from '@app/solutions/application/use-cases/get-published-solution.use-case';

@ApiTags('Solutions')
@Controller('solutions')
export class GetPublishedSolutionController {
  constructor(
    private readonly getPublishedSolutionUseCase: GetPublishedSolutionUseCase,
  ) {}

  @Get(':solutionId')
  @ApiOperation({ summary: 'Get a published solution' })
  @ApiOkResponse({ description: 'Solution found.' })
  async get(@Param() params: SolutionIdParamDto) {
    const solution = await this.getPublishedSolutionUseCase.execute(
      params.solutionId,
    );

    return successResponse(
      TokenCodes.SOLUTION_FOUND,
      SolutionPresenter.public(solution),
    );
  }
}
