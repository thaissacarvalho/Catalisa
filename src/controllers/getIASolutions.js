const { default: axios } = require("axios");
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
            const description = await Solutions.findOne({
                where: { id_solution: id_solution },
                attributes: ['description']
            })

            console.log(description);

            if (description == '') {
                return res.status(404).json({
                    status: false,
                    message: 'Descriptions não possui dados.',
                });
            }

            return {
                description
            }

        } else {
            text_input = text;
        }

        const url = 'http://1927.0.0.1:8000/analisar-texto';
        const response = await axios.post(url, { text: text_input }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = getIASolutions;