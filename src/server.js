const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const { sequelize } = require('./database');
const { routes } = require("./routes");

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', routes);

app.listen(port, () => {
  console.log(`Servidor rodando na http://localhost:${port}`);
});