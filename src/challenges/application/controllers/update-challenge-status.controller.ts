import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChallengeIdParamDto } from '@app/challenges/application/dto/challenge-id-param.dto';
import { UpdateChallengeStatusDto } from '@app/challenges/application/dto/update-challenge-status.dto';
import { ChallengePresenter } from '@app/challenges/application/presenters/challenge.presenter';
import { UpdateChallengeStatusUseCase } from '@app/challenges/application/use-cases/update-challenge-status.use-case';
import { Roles } from '@app/common/authentication/decorators/roles.decorator';
import { AdminPasswordUpdatedGuard } from '@app/common/authentication/guards/admin-password-updated.guard';
import { JwtAuthGuard } from '@app/common/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/authentication/guards/roles.guard';
import { successResponse } from '@app/common/http/success-response';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@ApiTags('Challenges')
@ApiBearerAuth()
@Controller('admin/challenges')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class UpdateChallengeStatusController {
  constructor(
    private readonly updateChallengeStatusUseCase: UpdateChallengeStatusUseCase,
  ) {}

  @Patch(':challengeId/status')
  @ApiOperation({ summary: 'Activate or deactivate a challenge' })
  @ApiOkResponse({ description: 'Challenge status updated.' })
  async update(
    @Param() params: ChallengeIdParamDto,
    @Body() data: UpdateChallengeStatusDto,
  ) {
    const challenge = await this.updateChallengeStatusUseCase.execute(
      params.challengeId,
      data.status,
    );

    return successResponse(
      CatalisaCodes.CHALLENGE_STATUS_UPDATED,
      ChallengePresenter.statusUpdated(challenge),
    );
  }
}
