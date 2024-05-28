const { Choice } = require('../models/Choice');

async function getSolutions(req, res) {
  try {
    const choices = await Choice.findAll({
      attributes: ['name_choice']
    });
    res.json(choices);
  } catch (error) {
    console.error('Erro ao buscar co-criações:', error);
    res.status(500).json({ error: 'Erro ao buscar co-criações' });
  }
}

module.exports = {
  getSolutions
};
