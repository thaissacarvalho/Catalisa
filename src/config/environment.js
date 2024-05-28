const env = require("env-var");
require('dotenv/config');

const DATABASE_URL = env.get("DATABASE_URL").asString() || "mysql://root:9090abcd@127.0.0.1:3306/sistema_febraban";

module.exports = { DATABASE_URL };
