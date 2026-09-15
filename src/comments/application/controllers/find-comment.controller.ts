import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenCodes } from '@app/common/http/token-codes';
import { successResponse } from '@app/common/http/success-response';
import { FindCommentUseCase } from '@app/comments/application/use-cases/find-comment.use-case';

@ApiTags('Comments')
@Controller('comments')
export class FindCommentController {
  constructor(private readonly findCommentUseCase: FindCommentUseCase) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Find a comment' })
  @ApiCreatedResponse({ description: 'Comment found.' })
  async create(@Body() id: string) {
    const comment = await this.findCommentUseCase.execute(id);

    return successResponse(TokenCodes.COMMENT_FOUND, comment);
  }
}