const { Likes } = require('../../legacy/models');

const newLike = async (req, res) => {
  const { id, userCode } = req.body;

  try {
    const existingLike = await Likes.findOne({
      where: { id, userCode },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.json({
        status: true,
        message: 'Like removido com sucesso',
        type: 2,
      });
    }

    await Likes.create({
      id,
      userCode,
      createdAt: new Date(),
    });

    return res.json({
      status: true,
      message: 'Like adicionado com sucesso',
      type: 1,
    });
  } catch (error) {
    return res.status(500).json('Error B1');
  }
};

module.exports = newLike;