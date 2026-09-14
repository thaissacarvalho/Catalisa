import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      'solutions',
      [
        {
          id: uuidv4(),
          userCode: 'user123',
          title: 'Tester Funcionando?',
          description: 'Para eu chegar aqui, o teste tem que está funcionando.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('solutions', {});
  },
};
