const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const { sequelize } = require('./database');
const getSolutions = require("./controllers/getSolutions");
const newLike = require("./controllers/newLike");
const getIASolutions = require("./controllers/getIASolutions");
const getCommentsByID = require("./controllers/getCommentsByID");
const newChallenge = require("./controllers/newChallenge");

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Helllllow EVERYONE');
})

app.get('/getSolutions', getSolutions);
app.post('/newLike', newLike);
app.get('/getIASolutions', getIASolutions);
app.get('/getCommentsByID', getCommentsByID);
app.post('/newChallenge', newChallenge);

app.listen(port, () => {
  console.log(`Servidor rodando na http://localhost:${port}`);
});