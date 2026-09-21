import { JwtPayload } from '@app/common/authentication/types/jwt-payload.type';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
import { SolutionPresenter } from '@app/solutions/application/presenters/solution.presenter';
import { ListSolutionsForAdminUseCase } from '@app/solutions/application/use-cases/list-solutions-for-admin.use-case';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@ApiTags('Solutions')
@ApiBearerAuth()
@Controller('admin/solutions')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class ListSolutionsForAdminController {
  constructor(
    private readonly listSolutionsForAdminUseCase: ListSolutionsForAdminUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all solutions for moderation' })
  @ApiOkResponse({ description: 'Solutions listed.' })
  async list(@Req() request: { user: JwtPayload }) {
    const solutions = await this.listSolutionsForAdminUseCase.execute(request.user.role);

    return successResponse(
      TokenCodes.SOLUTIONS_LISTED,
      solutions.map((solution) => SolutionPresenter.admin(solution)),
    );
  }
}
