import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('comments', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      solutionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'solutions',
          key: 'id',
        },
      },
      userCode: {
        type: DataTypes.STRING(40),
        allowNull: false,
        references: {
          model: 'users',
          key: 'userCode',
        },
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('comments');
  },
};
