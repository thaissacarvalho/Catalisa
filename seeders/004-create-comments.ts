import { randomUUID } from 'node:crypto';
import { QueryInterface, QueryTypes } from 'sequelize';

interface SeededUser {
  userCode: string;
}

interface SeededSolution {
  id: string;
}

export default {
  async up(queryInterface: QueryInterface) {
    const [user] = await queryInterface.sequelize.query<SeededUser>(
      `SELECT "userCode"
       FROM "users"
       ORDER BY "createdAt" ASC
       LIMIT 1`,
      { type: QueryTypes.SELECT },
    );

    const [solution] = await queryInterface.sequelize.query<SeededSolution>(
      `SELECT "id"
       FROM "solutions"
       ORDER BY "createdAt" ASC
       LIMIT 1`,
      { type: QueryTypes.SELECT },
    );

    if (!user || !solution) {
      throw new Error(
        'A seeded user and solution are required before creating comments.',
      );
    }

    await queryInterface.bulkInsert('comments', [
      {
        id: randomUUID(),
        solutionId: solution.id,
        userCode: user.userCode,
        comment: 'Ótima proposta para melhorar a comunicação da equipe.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('comments', {
      comment: 'Ótima proposta para melhorar a comunicação da equipe.',
    });
  },
};
