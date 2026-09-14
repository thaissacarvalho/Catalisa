import { QueryInterface } from 'sequelize';
import { generateUserCode } from '@app/utils/generateUserCode';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'Teste',
        email: 'teste@teste.com',
        status: 'ACTIVE',
        role: 'PARTICIPANT',
        jobPosition: 'Tester',
        enterprise: 'TestEnt',
        userCode: generateUserCode(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('users', {});
  },
};
