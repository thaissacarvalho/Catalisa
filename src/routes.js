const express = require("express");
const router = express.Router();
const solutionController = require("./controllers/solutionController");

router.get('/getSolutions', solutionController.getSolutions);

export { router }