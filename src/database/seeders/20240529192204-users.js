const generateUserHash = require('../../utils/generateUserHash'); 

module.exports = {
  async up(queryInterface, Sequelize) {
    const userHash = await generateUserHash('user_unique_value');

    await queryInterface.bulkInsert('users', [
      {
        name: 'Teste',
        email: 'teste@teste.com',
        cargo: 'Tester',
        empresa: 'TestEnt',
        user_hash: userHash,
        date_created: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
