import { ParseUUIDPipe } from '@nestjs/common';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TokenCodes } from '@app/common/http/token-codes';
import { successResponse } from '@app/common/http/success-response';
import { UpdateCommentStatusUseCase } from '../use-cases/update-comment-status.use-case';
import { UpdateCommentStatusDto } from '../dto/update-comment-status.dto';
import { Roles } from '@app/common/authentication/decorators/roles.decorator';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/common/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/authentication/guards/roles.guard';
import { AdminPasswordUpdatedGuard } from '@app/common/authentication/guards/admin-password-updated.guard';
import { JwtPayload } from '@app/common/authentication/types/jwt-payload.type';
@ApiTags('Comments')
@Controller('comments/admin')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class UpdateCommentStatusController {
  constructor(
    private readonly updateCommentStatusUseCase: UpdateCommentStatusUseCase,
  ) {}

  @Patch(':commentId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update comment status' })
  @ApiOkResponse({ description: 'Comment status updated.' })
  @ApiNotFoundResponse({ description: 'Comment id not found' })
  async updateStatus(
    @Param('commentId', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateCommentStatusDto,
    @Req()
    request: {
      user: JwtPayload;
    },
  ) {
    const comment = await this.updateCommentStatusUseCase.execute(
      id,
      data.status,
      request.user.role,
    );

    return successResponse(TokenCodes.COMMENT_STATUS_UPDATED, comment);
  }
}
