import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
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
import { JwtPayload } from '@app/common/authentication/types/jwt-payload.type';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';
import { SolutionIdParamDto } from '@app/solutions/application/dto/solution-id-param.dto';
import { UpdateSolutionStatusDto } from '@app/solutions/application/dto/update-solution-status.dto';
import { SolutionPresenter } from '@app/solutions/application/presenters/solution.presenter';
import { UpdateSolutionStatusUseCase } from '@app/solutions/application/use-cases/update-solution-status.use-case';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@ApiTags('Solutions')
@ApiBearerAuth()
@Controller('admin/solutions')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class UpdateSolutionStatusController {
  constructor(
    private readonly updateSolutionStatusUseCase: UpdateSolutionStatusUseCase,
  ) {}

  @Patch(':solutionId/status')
  @ApiOperation({ summary: 'Remove or republish a solution' })
  @ApiOkResponse({ description: 'Solution status updated.' })
  async update(
    @Param() params: SolutionIdParamDto,
    @Body() data: UpdateSolutionStatusDto,
    @Req() request: { user: JwtPayload },
  ) {
    const solution = await this.updateSolutionStatusUseCase.execute(
      params.solutionId,
      data.status,
      request.user.userCode,
      data.reason,
      UserRole.ADMIN
    );

    return successResponse(
      TokenCodes.SOLUTION_STATUS_UPDATED,
      SolutionPresenter.statusUpdated(solution),
    );
  }
}
