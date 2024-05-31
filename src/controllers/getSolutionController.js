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
    } else {
      res.send({ status: true, message: 'Choice does not exist.', choiceFound });
    }

    //  const solutions = await Solutions.findAll({
    //    attributes: ['id_choice', 'id_solution', 'id_user', 'title', 'description']
    //  });

    //  res.json(solutions);

    //  console.log("Depois da consulta ao banco de dados", solutions);

    //  if (solutions.length === 0) {
    //    return res.json(null);
    //  }

    // const response = solutions.map(solution => ({
    //   id_solution: solution.id_solution,
    //   title: solution.title,
    //   description: solution.description,
    //   'total-likes': solution.likes.length,
    //   'total-comments': solution.comments.length,
    // }));

    // console.log("Dados transformados:", response);
    // res.json(response);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Algum erro ocorreu [${error.code}]`,
    });
  }
}

module.exports = getSolutions;