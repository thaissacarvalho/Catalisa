const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("../config/environment");

const sequelize = new Sequelize(DATABASE_URL, {
    define: {
        underscored: true,
    }
})

module.exports = sequelize