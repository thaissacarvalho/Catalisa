const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
const Likes = require('./Likes');

class Users extends Model { }

Users.init({
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
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: Sequelize.UUIDV4
  },
  date_created: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'Users',
  tableName: 'users' 
});

Users.associate = (models) => {
  Users.hasMany(models.Likes, { as: 'likes', foreignKey: 'user_hash' });
}

module.exports = Users;