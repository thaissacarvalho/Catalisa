import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserLikeTargetDto } from '../dto/user-like-target.dto';
import { toLikeTargetFromDto } from '../helpers/to-like-target-from-dto.helper';
import { DeleteLikeUseCase } from '../use-cases/delete-like.use-case';

@ApiTags('Likes')
@Controller('likes')
export class DeleteLikeController {
  constructor(private readonly deleteLike: DeleteLikeUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an active participant’s like' })
  @ApiNoContentResponse({ description: 'Like absent or removed.' })
  async remove(@Query() query: UserLikeTargetDto): Promise<void> {
    await this.deleteLike.execute(query.userCode, toLikeTargetFromDto(query));
  }
}
