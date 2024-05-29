const Sequelize = require("sequelize");
const Solution = require("./Solution");
const User = require("./User");

module.exports = (sequelize, Sequelize) => {
    const Comments = sequelize.define("comments", {
        id_comment: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        id_solution: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Solution,
                key: 'id_solution',
            },
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id_user',
            },
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'solutions'
    });
    return Comments;
};