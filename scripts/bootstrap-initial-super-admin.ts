import { NestFactory } from '@nestjs/core';

import { AppModule } from '@app/app.module';
import { AuthenticationService } from '@app/common/authentication/authentication.service';
import { TokenCodes } from '@app/common/http/token-codes';

async function bootstrapInitialSuperAdmin(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const authenticationService = app.get(AuthenticationService);

    const superAdmin = await authenticationService.createInitialSuperAdmin();

    console.log(
      `[${TokenCodes.SUPER_ADMIN_CREATED.code}] ` +
        TokenCodes.SUPER_ADMIN_CREATED.message,
    );
    console.log(`userCode: ${superAdmin.userCode}`);
    console.log(`role: ${superAdmin.role}`);
    console.log(`Password change required: ${superAdmin.mustChangePassword}`);
  } finally {
    await app.close();
  }
}

void bootstrapInitialSuperAdmin();
