const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  port: 8889,
  username: "root",
  password: "root",
  database: "ventura_test",
});

module.exports = sequelize;