'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable({
      tableName: 'solutions',
    }, {
      id_solution: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_choice: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'choices',
          key: 'id_choice',
        },
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date_created: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({
      tableName: 'solutions',
    });
  }
};
