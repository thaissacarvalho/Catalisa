import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('comments', 'parentCommentId', {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addIndex(
      'comments',
      ['parentCommentId', 'createdAt'],
      {
        name: 'comments_parent_created_at_index',
      },
    );

    await queryInterface.sequelize.query(`
      ALTER TABLE "comments"
      ADD CONSTRAINT "comments_parent_not_self_check"
      CHECK ("parentCommentId" IS NULL OR "parentCommentId" <> "id")
    `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint(
      'comments',
      'comments_parent_not_self_check',
    );
    await queryInterface.removeIndex(
      'comments',
      'comments_parent_created_at_index',
    );
    await queryInterface.removeColumn('comments', 'parentCommentId');
  },
};
