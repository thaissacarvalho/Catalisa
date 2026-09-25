import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('comments', 'moderationReason', {
      type: DataTypes.STRING(500),
      allowNull: true,
    });

    await queryInterface.addColumn('comments', 'moderatedByUserCode', {
      type: DataTypes.STRING(40),
      allowNull: true,
      references: {
        model: 'users',
        key: 'userCode',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('comments', 'moderatedAt', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('comments', 'moderatedAt');
    await queryInterface.removeColumn('comments', 'moderatedByUserCode');
    await queryInterface.removeColumn('comments', 'moderationReason');
  },
};
