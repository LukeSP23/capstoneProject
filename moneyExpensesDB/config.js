const Sequelize = require("sequelize");

const sequelize = new Sequelize("moneyexpensesdb", "root", "Brayden15", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});

module.exports = sequelize;