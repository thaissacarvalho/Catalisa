import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListUserByIdUseCase } from '@app/users/application/use-cases/list-user-by-id.use-case';

@ApiTags('Users')
@Controller('users/admin')
export class ListUserByIdController {
  constructor(private readonly listUserByIdUseCase: ListUserByIdUseCase) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiOkResponse({ description: 'User found.' })
  async findBy(@Param('id') id: string) {
    return this.listUserByIdUseCase.execute(id);
  }
}
