const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
const Users = require("./Users");
const Choices = require("./Choices");

class Challenges extends Model { };

Challenges.init({
    id_challenge: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: Users,
            key: 'user_hash'
        }
    },
    choice: {
        type: DataTypes.STRING(150),
        allowNull: false,
        references: {
            model: Choices,
            key: 'uri_choice'
          }
    },
    data_created: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'Challenges',
    tableName: 'challenges'
});


Challenges.belongsTo(Users, {
    foreignKey: 'user_hash', 
    as: 'users', 
});

Challenges.belongsTo(Choices, {
    foreignKey: 'choice', 
    as: 'choices', 
});

module.exports = Challenges;
