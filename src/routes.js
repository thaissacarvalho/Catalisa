const express = require("express");
const { getSolutions } = require("./controllers/solutionController");
const routes = express.Router();

routes.get('/getSolutions', getSolutions);

module.exports = { routes }