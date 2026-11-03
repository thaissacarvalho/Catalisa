import { Sequelize } from 'sequelize';
import { environment } from '@app/config/environment';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: environment.database.host,
  port: environment.database.port,
  username: environment.database.username,
  password: environment.database.password,
  database: environment.database.name,
  ...(environment.nodeEnv === 'test' ? { logging: false } : {}),
});
