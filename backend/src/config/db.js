const { Sequelize } = require("sequelize");
require("dotenv").config();

const dialect = process.env.DB_DIALECT || "sqlite";

let sequelize;
if (dialect === "sqlite") {
  const path = require("path");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.resolve(process.env.DB_STORAGE || "./data/novasalud.sqlite"),
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "mysql",
      logging: false,
    }
  );
}

module.exports = sequelize;