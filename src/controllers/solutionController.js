const Solution = require('../models/Solution');

const getSolutions = async (req, res) => {
  const { choice } = req.query;

  try {
    const solutions = await Solution.findAll({
      where: { choice },
    });

    if (solutions.length === 0) {
      return res.json(null);
    }

    return res.json(solutions);
  } catch (error) {
    next({ status: 500, message: `Error ao `})
  }
};

module.exports = { getSolutions };
