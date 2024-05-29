const Sequelize = require("sequelize");
const sequelize = require("../database");

const Choice = sequelize.define("Choice", {
  id_choice: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name_choice: {
    type: Sequelize.DataTypes.STRING(150),
    allowNull: false,
  },
  uri_choice: {
    type: Sequelize.DataTypes.STRING(150),
    allowNull: false,
  },
  date_created: {
    type: Sequelize.DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'choices'
});

module.exports = { Choice }