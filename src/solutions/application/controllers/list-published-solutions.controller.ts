import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { successResponse } from '@app/common/http/success-response';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { ChallengeIdParamDto } from '@app/challenges/application/dto/challenge-id-param.dto';
import { SolutionPresenter } from '@app/solutions/application/presenters/solution.presenter';
import { ListPublishedSolutionsUseCase } from '@app/solutions/application/use-cases/list-published-solutions.use-case';

@ApiTags('Solutions')
@Controller('challenges')
export class ListPublishedSolutionsController {
  constructor(
    private readonly listPublishedSolutionsUseCase: ListPublishedSolutionsUseCase,
  ) {}

  @Get('/:challengeId/solutions')
  @ApiOperation({ summary: 'List published solutions for a challenge' })
  @ApiOkResponse({ description: 'Solutions listed.' })
  async list(@Param() params: ChallengeIdParamDto) {
    const solutions = await this.listPublishedSolutionsUseCase.execute(
      params.challengeId,
    );

    return successResponse(
      CatalisaCodes.SOLUTIONS_LISTED,
      solutions.map((solution) => SolutionPresenter.public(solution)),
    );
  }
}
