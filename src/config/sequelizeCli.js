require('dotenv').config();
const env = require('env-var');

console.log(process.env.DATABASE_URL);

module.exports = {
  development: {
    url: env.get('DATABASE_URL').required().asString(),
    dialect: 'mysql',
  },
  test: {
    url: env.get('DATABASE_URL').required().asString(),
    dialect: 'mysql',
  },
  production: {
    url: env.get('DATABASE_URL').required().asString(),
    dialect: 'mysql',
  }
};
