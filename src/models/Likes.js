const Sequelize = require("sequelize");
const User = require("./User");

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
            model: User,
            key: 'user_hash'
        }
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    return Likes;
  };