import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';
import { CreateUserDto } from '@app/users/application/dto/create-user-input.dto';
import { CreateUserUseCase } from '@app/users/application/use-cases/create-user.use-case';

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ description: 'User created.' })
  async create(@Body() userData: CreateUserDto) {
    const user = await this.createUserUseCase.execute(userData);

    return successResponse(TokenCodes.USER_CREATED, user);
  }
}
