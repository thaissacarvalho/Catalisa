const { Solutions, Comments, Likes, Choices } = require('../../legacy/models');

async function getSolutions(req, res) {
  const { choice } = req.query;

  if (!choice) {
    return res.status(400).json({
      status: false,
      message: 'O parâmetro "choice" é obrigatório.',
    });
  }

  try {
    const choiceFound = await Choices.findOne({
      where: { uri_choice: choice },
    });

    if (!choiceFound) {
      return res.status(404).json({
        status: false,
        message: 'Não existe opção de escolha com esse nome.',
      });
    }

    const idChoice = choiceFound.id;

    const solutions = await Solutions.findAll({
      where: { id: idChoice },
      attributes: ['id', 'title', 'description'],
    });

    if (solutions.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Solutions não encontradas para a choice especificada',
      });
    }

    const solutionsWithCounts = await Promise.all(
      solutions.map(async (solution) => {
        const totalLikes = await Likes.count({
          where: { id: solution.id },
        });

        const totalComments = await Comments.count({
          where: { id: solution.id },
        });

        return {
          id: solution.id,
          title: solution.title,
          description: solution.description,
          total_likes: totalLikes,
          total_comments: totalComments,
        };
      }),
    );

    res.json(solutionsWithCounts);
  } catch (error) {
    console.error('Erro ao buscar soluções: ', error);
    res.status(500).json('Error B3');
  }
}

module.exports = getSolutions;