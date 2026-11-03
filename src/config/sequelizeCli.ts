import env from 'env-var';
import 'dotenv/config';

function databaseConfig() {
  return {
    username: env.get('DB_USERNAME').required().asString(),
    password: env.get('DB_PASSWORD').required().asString(),
    database: env.get('DB_NAME').required().asString(),
    host: env.get('DB_HOST').required().asString(),
    port: env.get('DB_PORT').required().asPortNumber(),
    dialect: 'postgres' as const,
  };
}

const sequelizeCliConfig = {
  development: databaseConfig(),
  test: databaseConfig(),
  production: databaseConfig(),
};

export default sequelizeCliConfig;
