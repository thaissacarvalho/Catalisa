const { Solutions, Comments } = require("../models");

async function getCommentsByID(req, res) {

    const { id_solution } = req.query;

    if (!id_solution) {
        return res.status(400).json({
            status: false,
            message: 'O parâmetro "id_solution" é obrigatório.',
        });
    }

    try {
        const solution = await Solutions.findOne({
            where: { id_solution: parseInt(id_solution) }
        })

        if (!solution) {
            return res.status(404).json({
                status: false,
                message: `Solution com ID ${id_solution} não encontrada.`,
            });
        }

        const comments = await Comments.findAll({
            where: { id_solution: solution.id_solution },
            attributes: ['comment'],
        });

        res.json({ comments });
    } catch (error) {
        console.error(error);
        res.status(500).json('Error B5');
    }
}

module.exports = getCommentsByID;