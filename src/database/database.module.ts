import {
  Global,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { initializeModelAssociations } from '@app/database/model-associations';
import { sequelize } from '@app/database/sequelize';

export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useValue: sequelize,
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule implements OnModuleInit, OnApplicationShutdown {
  async onModuleInit(): Promise<void> {
    initializeModelAssociations();
    await sequelize.authenticate();
  }

  async onApplicationShutdown(): Promise<void> {
    await sequelize.close();
  }
}
