import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';
import { ListAllUsersUseCase } from '@app/users/application/use-cases/list-all-users.use-case';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { Roles } from '@app/common/authentication/decorators/roles.decorator';
import { JwtAuthGuard } from '@app/common/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/authentication/guards/roles.guard';
import { AdminPasswordUpdatedGuard } from '@app/common/authentication/guards/admin-password-updated.guard';

@ApiTags('Users')
@Controller('users/admin')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class ListUsersController {
  constructor(private readonly listAllUsersUseCase: ListAllUsersUseCase) {}

  @Get('/findAll')
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ description: 'Users found.' })
  @ApiNotFoundResponse({ description: '[]' })
  async findAll() {
    const users = await this.listAllUsersUseCase.execute();
    return successResponse(TokenCodes.USERS_LISTED, users);
  }
}
