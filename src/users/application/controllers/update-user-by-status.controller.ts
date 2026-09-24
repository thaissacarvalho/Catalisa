import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
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
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';
import { UpdateUserStatusDto } from '@app/users/application/dto/update-user-status.dto';
import { UpdateUserStatusUseCase } from '@app/users/application/use-cases/update-user-status.use-case';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@ApiTags('Users')
@Controller('users/admin')
export class UpdateUserByStatusController {
  constructor(
    private readonly updateUserStatusUseCase: UpdateUserStatusUseCase,
  ) {}

  @Patch('/:userCode/status')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user status' })
  @ApiOkResponse({ description: 'User status updated.' })
  async updateStatus(
    @Param('userCode') userCode: string,
    @Body() data: UpdateUserStatusDto,
  ) {
    const user = await this.updateUserStatusUseCase.execute(
      userCode,
      data.status,
    );

    return successResponse(TokenCodes.USER_STATUS_UPDATED, user);
  }
}
