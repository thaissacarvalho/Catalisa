const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const { sequelize } = require('./database');
const getSolutions = require("./controllers/solutionController");
// const { routes } = require("./routes");

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Helllllow')
})

app.get('/getSolutions', getSolutions);

app.listen(port, () => {
  console.log(`Servidor rodando na http://localhost:${port}`);
});