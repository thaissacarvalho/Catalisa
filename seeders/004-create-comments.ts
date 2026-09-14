import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      'comments',
      [
        {
          id: 1,
          comment: 'Testando 1, 2, 3',
          createdAt: new Date(),
        },
        {
          id: 2,
          comment: 'Teste 1, 2, 3',
          createdAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('comments', {});
  },
};
