import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('likes', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      solutionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'solutions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      commentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'comments',
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
      type: {
        type: DataTypes.ENUM('COMMENT', 'SOLUTION'),
        allowNull: false,
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

    await queryInterface.addIndex('likes', ['solutionId', 'userCode'], {
      name: 'likes_solution_user_unique',
      unique: true,
    });

    await queryInterface.addIndex('likes', ['commentId', 'userCode'], {
      name: 'likes_comment_user_unique',
      unique: true,
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "likes"
      ADD CONSTRAINT "likes_target_check"
      CHECK (
        (
          "type" = 'SOLUTION'
          AND "solutionId" IS NOT NULL
          AND "commentId" IS NULL
        )
      OR
        (
          "type" = 'COMMENT'
          AND "commentId" IS NOT NULL
          AND "solutionId" IS NULL
        )
      )
`);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('likes');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_likes_type";',
    );
  },
};
