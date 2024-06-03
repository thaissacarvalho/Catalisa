const Likes = require('../models/Likes');

const newLike = async (req, res) => {
  const { id_solution, user_hash } = req.body;

  try {
    // Verifica se já existe um like para a solução e usuário
    const existingLike = await Likes.findOne({
      where: { id_solution, user_hash }
    });

    if (existingLike) {
      // Se já existe, remove o like
      await existingLike.destroy();
      return res.json({
        status: true,
        message: 'Like removido com sucesso',
        type: 2
      });
    } else {
      // Se não existe, adiciona um novo like
      await Likes.create({
        id_solution,
        user_hash,
        date_created: new Date()
      });
      return res.json({
        status: true,
        message: 'Like adicionado com sucesso',
        type: 1
      });
    }
  } catch (error) {
    return res.json(error);
  }
};

module.exports = newLike;