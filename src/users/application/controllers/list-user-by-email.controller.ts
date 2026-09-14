import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListUserByEmailUseCase } from '@app/users/application/use-cases/list-user-by-email.use-case';

@ApiTags('Users')
@Controller('users/admin')
export class ListUserByEmailController {
  constructor(
    private readonly listUserByEmailUseCase: ListUserByEmailUseCase,
  ) {}

  @Get('/:email')
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiOkResponse({ description: 'User found.' })
  async findBy(@Param('email') email: string) {
    return this.listUserByEmailUseCase.execute(email);
  }
}
