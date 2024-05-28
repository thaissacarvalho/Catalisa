const express = require("express");
const routes = express.Router();
const { getSolutions } = require("./controllers/getSolutionController");

routes.get('/getSolutions', getSolutions);

module.exports = { routes }