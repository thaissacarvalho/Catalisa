import { randomUUID } from 'node:crypto';
import { QueryInterface, QueryTypes } from 'sequelize';

interface SeededUser {
  userCode: string;
}

interface SeededChallenge {
  id: number;
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

    const [challenge] = await queryInterface.sequelize.query<SeededChallenge>(
      `SELECT "id"
         FROM "challenges"
         WHERE "status" = 'ACTIVE'
         ORDER BY "displayOrder" ASC
         LIMIT 1`,
      { type: QueryTypes.SELECT },
    );

    if (!user || !challenge) {
      throw new Error(
        'A seeded user and active challenge are required before creating solutions.',
      );
    }

    await queryInterface.bulkInsert('solutions', [
      {
        id: randomUUID(),
        userCode: user.userCode,
        challengeId: challenge.id,
        title: 'Comunicação transparente com a equipe',
        description:
          'Realizar reuniões semanais para compartilhar decisões e resultados.',
        status: 'PUBLISHED',
        moderationReason: null,
        moderatedByUserCode: null,
        moderatedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('solutions', {
      title: 'Comunicação transparente com a equipe',
    });
  },
};
