import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('comments', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      solutionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'solutions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'EXCLUDED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('comments');
  },
};
