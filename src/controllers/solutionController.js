const { Choice } = require('../models/Choice');
const { customErrors } = require("../constants/customError");
const handleError = require("../utils/errorHandle");

async function getSolutions(req, res) {
  const choiceParam = req.params.choice;

  if (!choiceParam) {
    return handleError(res, 1);
  }

  try {
    const choice = await Choice.findOne({
      where: { uri_choice: choiceParam }
    });

    if (!choice) {
      return handleError(res, 3);
    }

    const solutions = await choice.getSolutions();

    if (!solutions || solutions.length === 0) {
      return res.status(200).json(null);
    }

    const formattedSolutions = solutions.map(solution => ({
      id_solution: solution.id_solution,
      title: solution.title,
      description: solution.description,
      total_likes: solution.total_likes,
      total_comments: solution.total_comments
    }));

    return res.status(200).json(formattedSolutions);
  } catch (error) {
    console.error('Erro ao buscar soluções:', error);
    return handleError(res, 6);
  }
}

module.exports = {
  getSolutions
};
