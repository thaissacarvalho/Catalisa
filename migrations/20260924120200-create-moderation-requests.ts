import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('moderation_requests', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      targetType: {
        type: DataTypes.ENUM('COMMENT', 'SOLUTION'),
        allowNull: false,
      },
      solutionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'solutions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      commentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'comments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      reason: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      requestedByUserCode: {
        type: DataTypes.STRING(40),
        allowNull: false,
        references: {
          model: 'users',
          key: 'userCode',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      reviewedByUserCode: {
        type: DataTypes.STRING(40),
        allowNull: true,
        references: {
          model: 'users',
          key: 'userCode',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      reviewReason: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      reviewedAt: {
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

    await queryInterface.sequelize.query(`
      ALTER TABLE "moderation_requests"
      ADD CONSTRAINT "moderation_requests_target_check"
      CHECK (
        (
          "targetType" = 'SOLUTION'
          AND "solutionId" IS NOT NULL
          AND "commentId" IS NULL
        )
        OR
        (
          "targetType" = 'COMMENT'
          AND "commentId" IS NOT NULL
          AND "solutionId" IS NULL
        )
      )
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "moderation_requests"
      ADD CONSTRAINT "moderation_requests_review_check"
      CHECK (
        (
          "status" = 'PENDING'
          AND "reviewedByUserCode" IS NULL
          AND "reviewReason" IS NULL
          AND "reviewedAt" IS NULL
        )
        OR
        (
          "status" IN ('APPROVED', 'REJECTED')
          AND "reviewedByUserCode" IS NOT NULL
          AND "reviewReason" IS NOT NULL
          AND "reviewedAt" IS NOT NULL
        )
      )
    `);

    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX "moderation_requests_pending_solution_unique"
      ON "moderation_requests" ("solutionId")
      WHERE "status" = 'PENDING' AND "solutionId" IS NOT NULL
    `);

    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX "moderation_requests_pending_comment_unique"
      ON "moderation_requests" ("commentId")
      WHERE "status" = 'PENDING' AND "commentId" IS NOT NULL
    `);

    await queryInterface.addIndex(
      'moderation_requests',
      ['status', 'createdAt'],
      { name: 'moderation_requests_status_created_at_index' },
    );

    await queryInterface.addIndex(
      'moderation_requests',
      ['requestedByUserCode', 'createdAt'],
      { name: 'moderation_requests_requester_created_at_index' },
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('moderation_requests');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_moderation_requests_targetType";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_moderation_requests_status";',
    );
  },
};
