import { Body, Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindCommentBySolutionUseCase } from '@app/comments/application/use-cases/find-comment-by-solution.use-case';

@ApiTags('comments')
@Controller('solutions')
export class FindCommentBySolutionController {
  constructor(private readonly findCommentBySolutionUseCase: FindCommentBySolutionUseCase) {}

  @Get(':solutionId/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find comments by solution ID' })
  @ApiCreatedResponse({ description: 'Comments found.' })
  async findBySolution(@Body() solutionId: string) {
    const comments = await this.findCommentBySolutionUseCase.execute(solutionId);
    return comments;
  }
}
