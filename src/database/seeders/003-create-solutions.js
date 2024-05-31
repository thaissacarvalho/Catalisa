'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('solutions', 
    [{
      id_user: 1,
      id_choice: 1,
      title: 'Tester Funcionando?',
      description: 'Para eu chegar aqui, o teste tem que está funcionando.',
      date_created: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('solutions', null, {});
  }
};
