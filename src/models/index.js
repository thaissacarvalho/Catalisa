const { Sequelize } = require('sequelize');
const config = require('../config/sequelizeCli');
const Choices = require('./Choices');
const Solutions = require('./Solutions');
const Users = require('./Users');
const Likes = require('./Likes');
const Comments = require('./Comments');

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development'].url);

module.exports = { sequelize, Choices, Solutions, Users, Likes, Comments };