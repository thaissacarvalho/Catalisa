'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('likes', { 
      id_like: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      id_solution: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'solutions',
          key: 'id_solution'
        }
      },
      user_hash: {
        type: Sequelize.STRING(150),
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_hash'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'   
      },
      date_created: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('likes');
  }
};
