const Sequelize = require("sequelize");
const Users = require("./Users");

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
    return Likes;
  };