import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
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
import { TokenCodes } from '@app/common/http/token-codes';
import { ListRemovalRequestsQueryDto } from '@app/moderation/application/dto/list-removal-requests-query.dto';
import { ListRemovalRequestsUseCase } from '@app/moderation/application/use-cases/list-removal-requests.use-case';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@ApiTags('Moderation')
@ApiBearerAuth()
@Controller('admin/moderation/removal-requests')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class ListRemovalRequestsController {
  constructor(
    private readonly listRemovalRequestsUseCase: ListRemovalRequestsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List removal requests' })
  @ApiOkResponse({ description: 'Removal requests listed.' })
  async list(
    @Query() query: ListRemovalRequestsQueryDto,
    @Req() request: { user: JwtPayload },
  ) {
    const result = await this.listRemovalRequestsUseCase.execute(
      request.user.role,
      query.status,
    );

    return successResponse(TokenCodes.MODERATION_REQUESTS_LISTED, result);
  }
}
