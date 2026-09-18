import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListUserByIdUseCase } from '@app/users/application/use-cases/list-user-by-id.use-case';
import { UserRole } from '@app/users/domain/enums/user-role.enum';
import { JwtAuthGuard } from '@app/common/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/authentication/guards/roles.guard';
import { AdminPasswordUpdatedGuard } from '@app/common/authentication/guards/admin-password-updated.guard';
import { Roles } from '@app/common/authentication/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users/admin')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN)
export class ListUserByIdController {
  constructor(private readonly listUserByIdUseCase: ListUserByIdUseCase) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiOkResponse({ description: 'User found.' })
  async findBy(@Param('id') id: string) {
    return this.listUserByIdUseCase.execute(id);
  }
}
