'use strict';

const { getUserHash } = require('../../utils/hashStorage');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userHash = getUserHash();
    
    await queryInterface.bulkInsert('likes', [{
      id_solution: '1',
      user_hash: userHash,
      date_created: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('likes', null, {});
  }
};
