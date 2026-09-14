import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('solutions', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      userCode: {
        type: DataTypes.STRING(40),
        allowNull: false,
        references: {
          model: 'users',
          key: 'userCode',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      challengeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'challenges',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PUBLISHED', 'REMOVED'),
        allowNull: false,
        defaultValue: 'PUBLISHED',
      },
      moderationReason: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      moderatedByUserCode: {
        type: DataTypes.STRING(40),
        allowNull: true,
        references: {
          model: 'users',
          key: 'userCode',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      moderatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
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

    await queryInterface.addIndex(
      'solutions',
      ['challengeId', 'status', 'createdAt'],
      {
        name: 'solutions_challenge_status_created_at_index',
      },
    );

    await queryInterface.addIndex('solutions', ['userCode', 'createdAt'], {
      name: 'solutions_user_code_created_at_index',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('solutions');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_solutions_status";',
    );
  },
};
