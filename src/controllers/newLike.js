const Likes = require('../models/Likes');

const newLike = async (req, res) => {
  const { id_solution, user_hash } = req.body;

  try {
    const existingLike = await Likes.findOne({
      where: { id_solution, user_hash }
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.json({
        status: true,
        message: 'Like removido com sucesso',
        type: 2
      });
    } else {
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
    return res.status(500).json('Error B1', error);
  }
};

module.exports = newLike;