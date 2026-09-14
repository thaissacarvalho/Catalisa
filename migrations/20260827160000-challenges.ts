import { DataTypes, Op, QueryInterface } from 'sequelize';

const CHALLENGE_STATUS_VALUES = ['ACTIVE', 'INACTIVE'] as const;

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('challenges', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...CHALLENGE_STATUS_VALUES),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      displayOrder: {
        type: DataTypes.SMALLINT,
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

    await queryInterface.addIndex('challenges', ['status', 'displayOrder'], {
      name: 'challenges_status_display_order_index',
    });

    await queryInterface.addConstraint('challenges', {
      fields: ['displayOrder'],
      type: 'check',
      name: 'challenges_display_order_positive',
      where: {
        displayOrder: {
          [Op.gt]: 0,
        },
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('challenges');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_challenges_status";',
    );
  },
};
