import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '@app/config/environment';
import { UsersModule } from '@app/users/users.module';
import { AuthenticationController } from '@app/common/authentication/authentication.controller';
import { AuthenticationService } from '@app/common/authentication/authentication.service';
import { ADMIN_CREDENTIAL_REPOSITORY } from '@app/common/authentication/domain/repositories/admin-credential.repository';
import { SequelizeAdminCredentialRepository } from '@app/common/authentication/infrastructure/persistence/sequelize/repositories/sequelize-admin-credential.repository';
import { AdminPasswordUpdatedGuard } from '@app/common/authentication/guards/admin-password-updated.guard';
import { JwtAuthGuard } from '@app/common/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@app/common/authentication/guards/roles.guard';

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: environment.authentication.jwtSecret,
      signOptions: {
        expiresIn: environment.authentication.jwtExpiresInSeconds,
        issuer: environment.authentication.jwtIssuer,
        audience: environment.authentication.jwtAudience,
        algorithm: 'HS256',
      },
      verifyOptions: {
        issuer: environment.authentication.jwtIssuer,
        audience: environment.authentication.jwtAudience,
        algorithms: ['HS256'],
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: ADMIN_CREDENTIAL_REPOSITORY,
      useClass: SequelizeAdminCredentialRepository,
    },
    JwtAuthGuard,
    RolesGuard,
    AdminPasswordUpdatedGuard,
  ],
  exports: [
    AuthenticationService,
    JwtAuthGuard,
    RolesGuard,
    AdminPasswordUpdatedGuard,
    JwtModule,
  ],
})
export class AuthenticationModule {}
