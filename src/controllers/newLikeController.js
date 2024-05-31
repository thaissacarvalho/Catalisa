const Likes = require("../models");

async function newLike(req, res) {
    const { id_solution, user_hash } = req.body;

    if (!id_solution || !user_hash) {
        return res.status(400).json({
            status: false,
            message: 'Os campos "id-solution" e "user_hash" são obrigatórios.',
        });
    }

    try {
        // Verificar se o like já existe
        const existingLike = await Likes.findOne({ where: { id_solution, user_hash } });

        if (existingLike) {
            // Se o like já existe, remover
            await existingLike.destroy();
            return res.json({
                status: true,
                message: 'Like removido com sucesso',
                type: 2,
            });
        } else {
            // Se o like não existe, adicionar
            await Likes.create({ id_solution, user_hash, date_created: new Date() });
            return res.json({
                status: true,
                message: 'Like adicionado com sucesso',
                type: 1,
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Alguma mensagem de erro [${error.message}]`,
        });
    }
}

module.exports = newLike;