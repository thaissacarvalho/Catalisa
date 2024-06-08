const { Comments, Users, Challenges, Choices } = require("../models");

async function newChallenge(req, res) {
    try {
        const data = req.body;
        if (data.type === 'comment') {
            let user = await Users.findOne({
                where: {
                    user_hash: data['user_hash'],
                },
            });

            if (!user) {
                user = await Users.create({
                    name: data['name'],
                    email: data['email'],
                    position: data['position'],
                    enterprise: data['enterprise'],
                    user_hash: data['user_hash'],
                    date_created: new Date()
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
                    message: 'O choice não foi encontrado.'
                });
            }
            
            const comment = await Comments.create({
                id_solution: data['id-solution'],
                comment: data['user-comment'],
                user_hash: data['user_hash'],
                id_user: user.id_user, 
                choice: choice.choice_name, 
                date_created: new Date()
            });

            return res.status(200).json({
                type: data.type,
                id_solution: data['id-solution'],
                user_comment: data['user-comment'],
                name: user.name,
                email: user.email,
                position: user.position,
                enterprise: user.enterprise,
                user_hash: data['user_hash'],
                choice: choice.choice_name, 
            });
        } else if (data.type === 'challenge') {
            const challenge = await Challenges.create({
                title: data.title,
                text: data.text,
                user_hash: data['user_hash'],
                choice: data['choice'],
            });

            const user = await Users.findOne({
                where: {
                    user_hash: data['user_hash'],
                },
            });

            return res.status(200).json({
                type: data.type,
                title: data.title,
                text: data.text,
                nome: user.nome,
                email: user.email,
                position: user.position,
                enterprise: user.enterprise,
                user_hash: data['user_hash'],
                choice: data['choice'],
            });
        } else {
            return res.status(400).json({
                status: false,
                message: 'Falha ao inserir o comment ou challenge.'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json('Error B2');
    }
}

module.exports = newChallenge;