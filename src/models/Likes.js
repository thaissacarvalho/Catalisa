const Sequelize = require("sequelize");
const Users = require("./Users");
const Solutions = require("./Solutions");

module.exports = (sequelize, Sequelize) => {
    const Likes = sequelize.define("likes", {
      id_like: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      id_solution: {
        type: DataTypes.STRING(150),
        allowNull: false,
        references: {
          model: Solutions,
          key: 'id_solution'
        }
      },
      user_hash: {
        type: DataTypes.STRING(150),
        allowNull: false,
        references: {
            model: Users,
            key: 'user_hash'
        }
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      timestamps: false,
    });

    Likes.associate = (models) => {
      Likes.belongsTo(models.Solutions, { as: 'solutions', foreignKey: 'id_solution' });
  };

    return Likes;
  };