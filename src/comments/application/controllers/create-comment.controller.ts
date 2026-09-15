import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from '@app/comments/application/dto/create-comment.dto';
import { CreateCommentUseCase } from '@app/comments/application/use-cases/create-comment.use-case';
import { TokenCodes } from '@app/common/http/token-codes';
import { successResponse } from '@app/common/http/success-response';

@ApiTags('Comments')
@Controller('comments')
export class CreateCommentController {
  constructor(private readonly createCommentUseCase: CreateCommentUseCase) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiCreatedResponse({ description: 'Comment created.' })
  async create(@Body() data: CreateCommentDto) {
    const comment = await this.createCommentUseCase.execute(data);

    return successResponse(TokenCodes.COMMENT_CREATED, comment);
  }
}