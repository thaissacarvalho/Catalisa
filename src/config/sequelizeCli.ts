import env from 'env-var';
import 'dotenv/config';

const sequelizeCliConfig = {
  development: {
    username: env.get('DB_USERNAME').required().asString(),
    password: env.get('DB_PASSWORD').required().asString(),
    database: env.get('DB_NAME').required().asString(),
    host: env.get('DB_HOST').required().asString(),
    port: env.get('DB_PORT').required().asPortNumber(),
    dialect: 'postgres',
  },
  production: {
    username: env.get('DB_USERNAME').required().asString(),
    password: env.get('DB_PASSWORD').required().asString(),
    database: env.get('DB_NAME').required().asString(),
    host: env.get('DB_HOST').required().asString(),
    port: env.get('DB_PORT').required().asPortNumber(),
    dialect: 'postgres',
  },
};

export default sequelizeCliConfig;
