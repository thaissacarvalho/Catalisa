const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const { sequelize } = require('./database');
const { router } = require("./routes");

const app = express();
const port = 3000;

app.use(express.json());

app.use(router);

app.listen(port, () => {

  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();

  console.log(`Servidor rodando na http://localhost:${port}`);
});