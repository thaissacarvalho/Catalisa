const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("../config/environment");

const sequelize = new Sequelize(DATABASE_URL, {
    define: {
        underscored: true,
    }
})

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

module.exports = sequelize;