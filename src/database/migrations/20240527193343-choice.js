'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Choices', {
      id_choice: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name_choice: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      uri_choice: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      date_created: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Choices', null, {});
  }
};
