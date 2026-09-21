import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountLikesUseCase } from '@app/likes/application/use-cases/count-likes.use-case';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';

@ApiTags('Likes')
@Controller('solutions')
export class CountLikesController {
  constructor(private readonly countLikes: CountLikesUseCase) {}

  @Get(':solutionId/likes/count')
  @ApiOperation({
    summary: 'Count likes from active users on a visible solution',
  })
  @ApiOkResponse({ description: 'Visible likes counted.' })
  async count(@Param('solutionId', new ParseUUIDPipe()) solutionId: string) {
    return successResponse(
      TokenCodes.LIKES_COUNTED,
      await this.countLikes.execute(solutionId),
    );
  }
}
