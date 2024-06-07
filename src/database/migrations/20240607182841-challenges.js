'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('challenges', {
      id_challenge: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      user_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_hash'
        }
      },
      choice: {
        type: Sequelize.STRING(150),
        allowNull: false,
        references: {
          model: 'choices',
          key: 'uri_choice'
        }
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('challenges');

  }
};
