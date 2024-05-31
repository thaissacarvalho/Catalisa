'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('comments', [{
      id_solution: 1,
      id_user: 1,
      comment: 'Testando 1, 2, 3',
      date_created: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {});
  }
};
