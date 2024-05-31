const { Sequelize } = require('sequelize');
const config = require('../config/sequelizeCli');
const Choices = require('./Choices');
const Solutions = require('./Solutions');
const Users = require('./Users');
const Likes = require('./Likes');
const Comments = require('./Comments');

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development'].url);

// Solutions.belongsTo(Choices, { as: 'choices', foreignKey: 'id_choice' });
// Solutions.hasMany(Comments, { as: 'comments', foreignKey: 'id_solution' });
// Solutions.hasMany(Likes, { as: 'likes', foreignKey: 'id_like' });

// Users.hasMany(Likes, { as: 'likes', foreignKey: 'user_hash' });

// Comments.belongsTo(Solutions, { as: 'solutions', foreignKey: 'id_solution' });

// Choices.hasMany(Solutions, { as: 'solutions', foreignKey: 'id_choice' });

// Likes.belongsTo(Solutions, { as: 'solutions', foreignKey: 'id_solution' });
// Likes.belongsTo(Users, { as: 'users', foreignKey: 'user_hash' });

module.exports = { sequelize, Choices, Solutions, Users, Likes, Comments };