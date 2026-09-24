import { Op, QueryInterface, QueryTypes } from 'sequelize';

const solutionLikeId = '6b778431-2f11-456a-966d-a93abf72d3ad';
const commentLikeId = '6b778431-2f11-456a-966d-a93abf72d3ae';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [user] = await queryInterface.sequelize.query<{ userCode: string }>(
        'SELECT "userCode" FROM "users" WHERE "status" = \'ACTIVE\' ORDER BY "createdAt", "userCode" LIMIT 1',
        { type: QueryTypes.SELECT, transaction },
      );
      const [solution] = await queryInterface.sequelize.query<{ id: string }>(
        'SELECT s."id" FROM "solutions" s JOIN "users" u ON u."userCode" = s."userCode" WHERE s."status" = \'PUBLISHED\' AND u."status" = \'ACTIVE\' ORDER BY s."createdAt", s."id" LIMIT 1',
        { type: QueryTypes.SELECT, transaction },
      );
      const [comment] = await queryInterface.sequelize.query<{ id: string }>(
        'SELECT c."id" FROM "comments" c JOIN "users" u ON u."userCode" = c."userCode" JOIN "solutions" s ON s."id" = c."solutionId" JOIN "users" a ON a."userCode" = s."userCode" WHERE c."status" = \'ACTIVE\' AND u."status" = \'ACTIVE\' AND s."status" = \'PUBLISHED\' AND a."status" = \'ACTIVE\' ORDER BY c."createdAt", c."id" LIMIT 1',
        { type: QueryTypes.SELECT, transaction },
      );
      if (!user || !solution || !comment) {
        throw new Error(
          'An active user, visible solution and visible comment are required before seeding likes.',
        );
      }
      const now = new Date();
      await queryInterface.bulkInsert(
        'likes',
        [
          {
            id: solutionLikeId,
            userCode: user.userCode,
            type: 'SOLUTION',
            solutionId: solution.id,
            commentId: null,
            createdAt: now,
            updatedAt: now,
          },
          {
            id: commentLikeId,
            userCode: user.userCode,
            type: 'COMMENT',
            solutionId: null,
            commentId: comment.id,
            createdAt: now,
            updatedAt: now,
          },
        ],
        { transaction },
      );
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('likes', {
      id: { [Op.in]: [solutionLikeId, commentLikeId] },
    });
  },
};
