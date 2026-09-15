import { Body, Controller, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenCodes } from '@app/common/http/token-codes';
import { successResponse } from '@app/common/http/success-response';
import { UpdateCommentStatusUseCase } from '../use-cases/update-comment-status.use-case';
import { UpdateCommentStatusDto } from '../dto/update-comment-status.dto';

@ApiTags('Comments')
@Controller('comments/admin')
export class UpdateCommentStatusController {
  constructor(private readonly updateCommentStatusUseCase: UpdateCommentStatusUseCase) { }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update comment status' })
  @ApiCreatedResponse({ description: 'Comment status updated.' })
  async updateStatus(@Body() data: UpdateCommentStatusDto) {
    const comment = await this.updateCommentStatusUseCase.execute(data.id, data.status);

    return successResponse(TokenCodes.COMMENT_STATUS_UPDATED, comment);
  }
}