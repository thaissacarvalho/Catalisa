import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppHttpException } from '@app/common/http/app-http.exception';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';
import { ListUserByUserCodeUseCase } from '@app/users/application/use-cases/list-user-by-user-code.use-case';

@ApiTags('Users')
@Controller('users')
export class GetUserByUserCodeController {
  constructor(
    private readonly listUserByUserCodeUseCase: ListUserByUserCodeUseCase,
  ) {}

  @Get(':userCode')
  @ApiOperation({ summary: 'Find a public user profile by hash' })
  @ApiOkResponse({ description: 'User found.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async findBy(@Param('userCode') userCode: string) {
    const user = await this.listUserByUserCodeUseCase.execute(userCode);

    if (!user) {
      throw new AppHttpException(TokenCodes.USER_NOT_FOUND);
    }

    return successResponse(TokenCodes.USER_FOUND, {
      userCode: user.userCode,
      name: user.name,
      jobPosition: user.jobPosition,
      enterprise: user.enterprise,
    });
  }
}
