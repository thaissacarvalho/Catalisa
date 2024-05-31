const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");
const Choices = require("./Choices");
const Users = require("./Users");

class Solutions extends Model {}

Solutions.init({
    id_solution: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id_user',
        },
    },
    id_choice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Choices,
            key: 'id_choice',
        },
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_created: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    timestamps: false,
    modelName: 'Solutions',
    tableName: 'solutions'
});

Solutions.associate = (models) => {
    Solutions.hasMany(models.Comments, { as: 'comments', foreignKey: 'id_solution' });
    Solutions.hasMany(models.Likes, { as: 'likes', foreignKey: 'id_solution' });
};

module.exports = Solutions;
