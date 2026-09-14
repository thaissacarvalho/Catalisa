import { DataTypes, QueryInterface, QueryTypes } from 'sequelize';

type LegacyCredential = {
  id: string;
  passwordHash: string;
  mustChangePassword: boolean;
};

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('admin_credentials', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      must_change_password: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      password_changed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    const usersTable = await queryInterface.describeTable('users');

    if ('passwordHash' in usersTable) {
      const credentials =
        await queryInterface.sequelize.query<LegacyCredential>(
          'SELECT id, "passwordHash", "mustChangePassword" FROM users WHERE "passwordHash" IS NOT NULL',
          { type: QueryTypes.SELECT },
        );

      if (credentials.length > 0) {
        await queryInterface.bulkInsert(
          'admin_credentials',
          credentials.map((credential) => ({
            id: crypto.randomUUID(),
            user_id: credential.id,
            password_hash: credential.passwordHash,
            must_change_password: credential.mustChangePassword,
            created_at: new Date(),
            updated_at: new Date(),
          })),
        );
      }

      await queryInterface.removeColumn('users', 'passwordHash');
      await queryInterface.removeColumn('users', 'mustChangePassword');
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.addColumn('users', 'passwordHash', {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'mustChangePassword', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.dropTable('admin_credentials');
  },
};
