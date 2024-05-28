const { Sequelize } = require('sequelize');
const config = require('../config/sequelizeCli');

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development'].url);

module.exports = sequelize;