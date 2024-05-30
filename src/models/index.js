const { Sequelize } = require('sequelize');
const config = require('../config/sequelizeCli');
const { Choice } = require('./Choice');
const { Solution } = require('./Solution');

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development'].url);

// getSolution 
Choice.hasMany(Solution, { as: 'solutions', foreignKey: 'id_choice' });
Solution.belongsTo(Choice, { foreignKey: 'id_choice' });

module.exports = sequelize;