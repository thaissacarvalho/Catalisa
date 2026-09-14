import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('likes', {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('likes');
  },
};
