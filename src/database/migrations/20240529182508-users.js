'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', { 
      id_user: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      cargo: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      empresa: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      user_hash: {
        type: Sequelize.STRING(36),
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      date_created: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }
    );

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
