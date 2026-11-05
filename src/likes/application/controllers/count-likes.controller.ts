import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountByLikeUseCase } from '@app/likes/application/use-cases/count-by-like.use-case';
import { successResponse } from '@app/common/http/success-response';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { LikeTargetDto } from '@app/likes/application/dto/like-target.dto';
import { toLikeTargetFromDto } from '@app/likes/application/helpers/to-like-target-from-dto.helper';

@ApiTags('Likes')
@Controller('likes')
export class CountByLikeController {
  constructor(private readonly countByLike: CountByLikeUseCase) {}

  @Get('count')
  @ApiOperation({
    summary: 'Count likes from active users on a visible solution or comment',
  })
  @ApiOkResponse({ description: 'Visible likes counted.' })
  async count(@Query() query: LikeTargetDto) {
    const target = toLikeTargetFromDto(query);
    const result = await this.countByLike.execute(target);

    return successResponse(CatalisaCodes.LIKES_COUNTED, result);
  }
}
