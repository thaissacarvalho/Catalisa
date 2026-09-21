import { ParseUUIDPipe } from '@nestjs/common';
import { Controller, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindCommentBySolutionUseCase } from '@app/comments/application/use-cases/find-comment-by-solution.use-case';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';

@ApiTags('comments')
@Controller('solutions')
export class FindCommentBySolutionController {
  constructor(
    private readonly findCommentBySolutionUseCase: FindCommentBySolutionUseCase,
  ) {}

  @Get(':solutionId/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find comments by solution ID' })
  @ApiOkResponse({ description: 'Comments found.' })
  @ApiNotFoundResponse({
    description: 'Comments vinculed by solution not found',
  })
  async findBySolution(
    @Param('solutionId', new ParseUUIDPipe()) solutionId: string,
  ) {
    const comments =
      await this.findCommentBySolutionUseCase.execute(solutionId);

    return successResponse(TokenCodes.COMMENT_FOUND, comments);
  }
}
