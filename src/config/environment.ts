import env from 'env-var';
import 'dotenv/config';

const jwtSecret = env.get('JWT_SECRET').required().asString();

if (Buffer.byteLength(jwtSecret, 'utf8') < 32) {
  throw new Error('JWT_SECRET must contain at least 32 bytes');
}

const nodeEnv = env
  .get('NODE_ENV')
  .default('development')
  .asEnum(['development', 'test', 'production']);

export const environment = {
  nodeEnv,
  app: {
    host: env.get('APP_HOST').default('0.0.0.0').asString(),
    port: env.get('APP_PORT').default('3000').asPortNumber(),
  },
  database: {
    host: env.get('DB_HOST').required().asString(),
    port: env.get('DB_PORT').required().asPortNumber(),
    name: env.get('DB_NAME').required().asString(),
    username: env.get('DB_USERNAME').required().asString(),
    password: env.get('DB_PASSWORD').required().asString(),
  },
  authentication: {
    jwtSecret,
    jwtExpiresInSeconds: env
      .get('JWT_EXPIRES_IN_SECONDS')
      .default('28800')
      .asIntPositive(),
    jwtIssuer: env.get('JWT_ISSUER').default('catalisa-api').asString(),
    jwtAudience: env.get('JWT_AUDIENCE').default('catalisa-admin').asString(),

    initialSuperAdmin: {
      name: process.env.INITIAL_SUPER_ADMIN_NAME ?? '',
      email: process.env.INITIAL_SUPER_ADMIN_EMAIL ?? '',
      jobPosition: process.env.INITIAL_SUPER_ADMIN_JOB_POSITION ?? '',
      enterprise: process.env.INITIAL_SUPER_ADMIN_ENTERPRISE ?? '',
      password: process.env.INITIAL_SUPER_ADMIN_PASSWORD ?? '',
    },
  },
};
