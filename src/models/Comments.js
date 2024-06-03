const { DataTypes, Model } = require("sequelize");
const Solutions = require("./Solutions");
const Users = require("./Users");
const sequelize = require("../database");

class Comments extends Model { };

Comments.init({
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
            model: Solutions,
            key: 'id_solution',
        },
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
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
    sequelize, 
    timestamps: false,
    modelName: 'Comments',
    tableName: 'comments'
})

Comments.associate = (models) => {
    Comments.belongsTo(models.Solutions, { as: 'solutions', foreignKey: 'id_solution' });
};

module.exports = Comments;