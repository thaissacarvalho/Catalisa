const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const { sequelize } = require('./database');
const getSolutions = require("./controllers/getSolutionController");
const newLike = require("./controllers/newLikeController");
const getTest = require("./controllers/getTestController");

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Helllllow')
})

app.get('/getTest', getTest);
app.get('/getSolutions', getSolutions);
app.post('/newLike', newLike);

app.listen(port, () => {
  console.log(`Servidor rodando na http://localhost:${port}`);
});