const Sequelize = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      cargo: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      empresa: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      user_hash: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUID4
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });
  
    return Users;
  };