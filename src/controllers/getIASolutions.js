const axios = require('axios');
const { Solutions } = require("../models");

async function getIASolutions(req, res) {
    const { id_solution, text } = req.query;

    if (!text && !id_solution) {
        return res.status(400).json({
            status: false,
            message: 'O parâmetro "text" ou "id_solution" é obrigatório.',
        });
    }

    try {
        let text_input;

        if (id_solution) {
            const solution = await Solutions.findOne({
                where: { id_solution: id_solution },
                attributes: ['description']
            });

            if (!solution) {
                return res.status(404).json({
                    status: false,
                    message: 'Solução não encontrada para o ID fornecido.',
                });
            }

            text_input = solution.description;
        } else {
            text_input = text;
        }

        const url = 'http://127.0.0.1:8000/analisar-texto';
        const response = await axios.post(url, { text: text_input }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);

    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({
            status: false,
            message: 'Erro interno do servidor.',
            error: error.message
        });
    }
}

module.exports = getIASolutions;