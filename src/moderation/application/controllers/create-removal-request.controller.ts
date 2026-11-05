import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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
import { CreateRemovalRequestDto } from '@app/moderation/application/dto/create-removal-request.dto';
import { CreateRemovalRequestUseCase } from '@app/moderation/application/use-cases/create-removal-request.use-case';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@ApiTags('Moderation')
@ApiBearerAuth()
@Controller('admin/moderation/removal-requests')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class CreateRemovalRequestController {
  constructor(
    private readonly createRemovalRequestUseCase: CreateRemovalRequestUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Request logical removal of a solution or comment' })
  @ApiCreatedResponse({ description: 'Removal request created.' })
  async create(
    @Body() data: CreateRemovalRequestDto,
    @Req() request: { user: JwtPayload },
  ) {
    const result = await this.createRemovalRequestUseCase.execute(
      data.targetType,
      data.targetId,
      data.reason,
      request.user.userCode,
      request.user.role,
    );

    return successResponse(CatalisaCodes.MODERATION_REQUEST_CREATED, result);
  }
}
