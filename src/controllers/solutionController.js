const Choice = require("../models/Choice");
const Solution = require("../models/Solution");

async function getSolutions(req, res) {
  try {
    const choiceUri = req.query.choice;
    const choice = await Choice.findOne({ where: { uri_choice: choiceUri } });

    if (!choice) {
      return res.status(404).json({ error: 'Choice não encontrado' });
    }

    const solutions = await Solution.findAll({ where: { id_choice: choice.id_choice } });

    res.json(solutions);
  } catch (error) {
    console.error('Erro ao buscar soluções:', error);
    res.status(500).json({ error: 'Erro ao buscar soluções' });
  }
}

module.exports = getSolutions;
