const { Comments, Users, Challenges, Choices } = require('../../legacy/models');

async function newChallenge(req, res) {
  try {
    const data = req.body;

    if (data.type === 'comment') {
      let user = await Users.findOne({
        where: {
          userCode: data['userCode'],
        },
      });

      if (!user) {
        user = await Users.create({
          name: data['name'],
          email: data['email'],
          jobPosition: data['jobPosition'],
          enterprise: data['enterprise'],
          userCode: data['userCode'],
          createdAt: new Date(),
        });
      }

      const choice = await Choices.findOne({
        where: {
          uri_choice: data['choice'],
        },
      });

      if (!choice) {
        return res.status(400).json({
          status: false,
          message: 'O choice não foi encontrado.',
        });
      }

      const comment = await Comments.create({
        id: data['id-solution'],
        comment: data['user-comment'],
        userCode: data['userCode'],
        userId: user.id,
        choice: choice.choice_name,
        createdAt: new Date(),
      });

      return res.status(200).json({
        type: data.type,
        solutionId: data['id-solution'],
        user_comment: data['user-comment'],
        name: user.name,
        email: user.email,
        jobPosition: user.jobPosition,
        enterprise: user.enterprise,
        userCode: data['userCode'],
        choice: choice.choice_name,
      });
    }

    if (data.type === 'challenge') {
      const challenge = await Challenges.create({
        title: data.title,
        text: data.text,
        userCode: data['userCode'],
        choice: data['choice'],
        createdAt: new Date(),
      });

      const user = await Users.findOne({
        where: {
          userCode: data['userCode'],
        },
      });

      return res.status(200).json({
        type: data.type,
        title: challenge.title,
        text: challenge.text,
        nome: user.nome,
        email: user.email,
        jobPosition: user.jobPosition,
        enterprise: user.enterprise,
        userCode: data['userCode'],
        choice: data['choice'],
      });
    }

    return res.status(400).json({
      status: false,
      message: 'Falha ao inserir o comment ou challenge.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json('Error B2');
  }
}

module.exports = newChallenge;