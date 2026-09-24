import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';
import { UserLikeTargetDto } from '../dto/user-like-target.dto';
import { toLikeTargetFromDto } from '../helpers/to-like-target-from-dto.helper';
import { CreateLikeUseCase } from '../use-cases/create-like.use-case';

@ApiTags('Likes')
@Controller('likes')
export class CreateLikeController {
  constructor(private readonly createLike: CreateLikeUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Like a visible solution or comment as an active participant',
  })
  @ApiCreatedResponse({ description: 'Like created.' })
  async create(@Body() data: UserLikeTargetDto) {
    const like = await this.createLike.execute(
      data.userCode,
      toLikeTargetFromDto(data),
    );

    return successResponse(TokenCodes.LIKE_CREATED, like);
  }
}
