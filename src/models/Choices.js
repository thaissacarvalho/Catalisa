const Sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Choices = sequelize.define("choices", {
      id_choice: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name_choice: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      uri_choice: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      date_created: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    return Choices;
  };