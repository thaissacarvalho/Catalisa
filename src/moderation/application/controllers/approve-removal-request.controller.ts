import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@app/common/authentication/decorators/roles.decorator';
import { AdminPasswordUpdatedGuard } from '@app/common/authentication/guards/admin-password-updated.guard';
import { JwtAuthGuard } from '@app/common/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/authentication/guards/roles.guard';
import { JwtPayload } from '@app/common/authentication/types/jwt-payload.type';
import { successResponse } from '@app/common/http/success-response';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { ReviewRemovalRequestDto } from '@app/moderation/application/dto/review-removal-request.dto';
import { ReviewRemovalRequestUseCase } from '@app/moderation/application/use-cases/review-removal-request.use-case';
import { ModerationRequestStatus } from '@app/moderation/domain/enums/moderation-request-status.enum';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@ApiTags('Moderation')
@ApiBearerAuth()
@Controller('admin/moderation/removal-requests')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class ApproveRemovalRequestController {
  constructor(
    private readonly reviewRemovalRequestUseCase: ReviewRemovalRequestUseCase,
  ) {}

  @Patch(':requestId/approve')
  @ApiOperation({ summary: 'Approve a removal request' })
  @ApiOkResponse({ description: 'Removal request approved.' })
  async approve(
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Body() data: ReviewRemovalRequestDto,
    @Req() request: { user: JwtPayload },
  ) {
    const result = await this.reviewRemovalRequestUseCase.execute(
      requestId,
      ModerationRequestStatus.APPROVED,
      request.user.userCode,
      request.user.role,
      data.reason,
    );

    return successResponse(CatalisaCodes.MODERATION_REQUEST_APPROVED, result);
  }
}
