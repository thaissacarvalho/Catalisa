import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from '@app/common/authentication/authentication.service';
import { Roles } from '@app/common/authentication/decorators/roles.decorator';
import { AdminLoginDto } from '@app/common/authentication/dto/admin-login.dto';
import { UpdateAdminPasswordDto } from '@app/common/authentication/dto/update-admin-password.dto';
import { AdminPasswordUpdatedGuard } from '@app/common/authentication/guards/admin-password-updated.guard';
import { JwtAuthGuard } from '@app/common/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/authentication/guards/roles.guard';
import { JwtPayload } from '@app/common/authentication/types/jwt-payload.type';
import { successResponse } from '@app/common/http/success-response';
import { TokenCodes } from '@app/common/http/token-codes';
import { UserRole } from '@app/users/domain/enums/user-role.enum';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Login as an admin' })
  async login(@Body() data: AdminLoginDto) {
    const authentication = await this.authenticationService.loginAdmin(
      data.email,
      data.password,
    );
    return successResponse(TokenCodes.ADMIN_AUTHENTICATED, authentication);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated identity' })
  me(@Req() request: { user: JwtPayload }) {
    return successResponse(TokenCodes.AUTHENTICATED_IDENTITY_RETRIEVED, {
      userCode: request.user.userCode,
      role: request.user.role,
      mustChangePassword: request.user.mustChangePassword,
    });
  }

  @Patch('admin/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Update an admin password' })
  async updatePassword(
    @Req() request: { user: JwtPayload },
    @Body() data: UpdateAdminPasswordDto,
  ) {
    const result = await this.authenticationService.updateAdminPassword(
      request.user.userCode,
      data.currentPassword,
      data.newPassword,
    );
    return successResponse(TokenCodes.ADMIN_PASSWORD_UPDATED, result);
  }

  @Post('admin/users/:userCode/promote')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminPasswordUpdatedGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Promote a participant to admin' })
  async promote(@Param('userCode') userCode: string) {
    const admin = await this.authenticationService.promoteToAdmin(userCode);
    return successResponse(TokenCodes.USER_PROMOTED_TO_ADMIN, admin);
  }
}
