const Sequelize = require("sequelize");
const Choices = require("./Choices");

module.exports = (sequelize, Sequelize) => {
    const Solutions = sequelize.define("solutions", {
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
                model: User,
                key: 'id_user',
            },
        },
        id_choice: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Choices,
                key: 'id_choices',
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
    });
    return Solutions;
};