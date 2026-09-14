const { Solutions, Comments } = require('../../legacy/models');

async function getCommentsByID(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      status: false,
      message: 'O parâmetro "id" é obrigatório.',
    });
  }

  try {
    const solution = await Solutions.findOne({
      where: { id: parseInt(id) },
    });

    if (!solution) {
      return res.status(404).json({
        status: false,
        message: `Solution com ID ${id} não encontrada.`,
      });
    }

    const comments = await Comments.findAll({
      where: { id: solution.id },
      attributes: ['comment'],
    });

    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json('Error B5');
  }
}

module.exports = getCommentsByID;