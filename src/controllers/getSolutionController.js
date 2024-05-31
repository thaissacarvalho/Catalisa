const { Solutions, Comments, Likes, Choices } = require("../models");

async function getSolutions(req, res) {
  const { choice } = req.query;

  if (!choice) {
    return res.status(400).json({
      status: false,
      message: 'O parâmetro "choice" é obrigatório.',
    });
  }

  try {
    console.log("Antes da consulta ao banco de dados");
    console.log("Valor de 'choice': ", choice);

    const choiceFound = await Choices.findOne({
      where: { uri_choice: choice },
    });

    const idChoice = choiceFound.id_choice;
    console.log('This id choice is: ', idChoice);

    if (choiceFound) {
      const solutions = await Solutions.findAll({
        where: { id_choice: idChoice },
      });

      if (solutions.length > 0) {
        res.send(solutions);
      } else {
        res.status(404).send('Solutions não encontradas para a choice especificada');
      }
    }

  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Algum erro ocorreu [${error.code}]`,
    });
  }
}

module.exports = getSolutions;