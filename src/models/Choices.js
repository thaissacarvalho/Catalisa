const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const Solutions = require("./Solutions");

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
}, {
  timestamps: false,
});

Choices.hasMany(Solutions, {
  foreignKey: 'id_choice',
  as: 'solutions'
});

module.exports = Choices;