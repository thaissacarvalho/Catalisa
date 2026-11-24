import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ListUserByEmailUseCase } from '@app/users/application/use-cases/list-user-by-email.use-case';
import { Roles } from '@app/common/authentication/decorators/roles.decorator';
import { JwtAuthGuard } from '@app/common/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/authentication/guards/roles.guard';
import { AdminPasswordUpdatedGuard } from '@app/common/authentication/guards/admin-password-updated.guard';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { successResponse } from '@app/common/http/success-response';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';

@ApiTags('Users')
@Controller('users/admin')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class ListUserByEmailController {
  constructor(
    private readonly listUserByEmailUseCase: ListUserByEmailUseCase,
  ) {}

  @Get('/:email')
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiOkResponse({ description: 'User found.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async findBy(@Param('email') email: string) {
    const user = await this.listUserByEmailUseCase.execute(email);
    return successResponse(CatalisaCodes.USER_FOUND, user);
  }
}
