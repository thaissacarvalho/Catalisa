const { Comments, Solutions } = require("../models");

async function saveComment(data) {
    const existingSolution = await Solutions.findOne({
        where: { id: data['id_comment'] },
    });

    if (!existingSolution) {
        const solution = {
            id: data['id_comment'],
            userComment: data['user-comment'],
            solutionId: data.solutionId,
            userId: data.userId,
            userHash: data.user_hash,
            choiceId: data.choiceId,
        };

        await Comments.create(comment);

        // Obter o nome da Choice
        const choiceName = await getChoiceNameById(data.choiceId);

        // Retornar o nome da Choice na resposta
        const response = {
            choiceName: choiceName,
            // ... outros dados da resposta
        };

        res.status(201).send(response);
    }
}

async function saveChallenge(data) {
    const existingChallenge = await Challenge.findOne({
        where: { title: data.title },
    });

    if (!existingChallenge) {
        const challenge = {
            title: data.title,
            text: data.text,
            solutionId: data.solutionId,
            userId: data.userId,
            userHash: data.user_hash,
            choiceId: data.choiceId,
        };

        await Challenge.create(challenge);

        // Obter o nome da Choice
        const choiceName = await getChoiceNameById(data.choiceId);

        // Retornar o nome da Choice na resposta
        const response = {
            choiceName: choiceName,
            // ... outros dados da resposta
        };

        res.status(201).send(response);
    }
}

async function getChoiceNameById(idChoice) {
    const choice = await Choice.findOne({
        where: { id: idChoice },
    });

    if (choice) {
        return choice.name;
    } else {
        return null;
    }
}