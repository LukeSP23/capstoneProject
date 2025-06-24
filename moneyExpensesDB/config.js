const Sequelize = require("sequelize");
require("dotenv").config();


const HOST = process.env.DB_HOST;
const DATABASE = process.env.DATABASE;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DB_PORT = process.env.DB_PORT

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect: process.env.DB_DIALECT,
  port: DB_PORT,
});

module.exports = sequelize;