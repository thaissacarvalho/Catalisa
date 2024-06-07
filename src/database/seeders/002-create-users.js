const generateUserHash = require('../../utils/generateUserHash'); 
const { setUserHash } = require('../../utils/hashStorage');

module.exports = {
  async up(queryInterface, Sequelize) {
    const userHash = await generateUserHash('user_unique_value');

    setUserHash(userHash);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Teste',
        email: 'teste@teste.com',
        position: 'Tester',
        enterprise: 'TestEnt',
        user_hash: userHash,
        date_created: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
