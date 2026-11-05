import { ParseUUIDPipe } from '@nestjs/common';
import { Controller, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { successResponse } from '@app/common/http/success-response';
import { FindCommentUseCase } from '@app/comments/application/use-cases/find-comment.use-case';

@ApiTags('Comments')
@Controller('comments')
export class FindCommentController {
  constructor(private readonly findCommentUseCase: FindCommentUseCase) {}

  @Get('/:commentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find a comment' })
  @ApiOkResponse({ description: 'Comment found.' })
  async create(@Param('commentId', new ParseUUIDPipe()) id: string) {
    const comment = await this.findCommentUseCase.execute(id);

    return successResponse(CatalisaCodes.COMMENT_FOUND, comment);
  }
}
