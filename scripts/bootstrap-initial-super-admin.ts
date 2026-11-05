import { NestFactory } from '@nestjs/core';

import { AppModule } from '@app/app.module';
import { AuthenticationService } from '@app/common/authentication/authentication.service';
import { CatalisaCodes } from '@app/common/http/catalisa-codes';

async function bootstrapInitialSuperAdmin(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const authenticationService = app.get(AuthenticationService);

    const superAdmin = await authenticationService.createInitialSuperAdmin();

    console.log(
      `[${CatalisaCodes.SUPER_ADMIN_CREATED.code}] ` +
        CatalisaCodes.SUPER_ADMIN_CREATED.message,
    );
    console.log(`userCode: ${superAdmin.userCode}`);
    console.log(`role: ${superAdmin.role}`);
    console.log(`Password change required: ${superAdmin.mustChangePassword}`);
  } finally {
    await app.close();
  }
}

void bootstrapInitialSuperAdmin();
