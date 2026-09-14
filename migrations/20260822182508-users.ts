import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(320),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED', 'SUSPENDED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      role: {
        type: DataTypes.ENUM('PARTICIPANT', 'ADMIN', 'SUPER_ADMIN'),
        allowNull: false,
        defaultValue: 'PARTICIPANT',
      },
      jobPosition: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      enterprise: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      userCode: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
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

    await queryInterface.addIndex('users', ['role'], {
      name: 'users_unique_super_admin',
      unique: true,
      where: {
        role: 'SUPER_ADMIN',
      },
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.removeIndex('users', 'users_unique_super_admin');
    await queryInterface.dropTable('users');
  },
};
