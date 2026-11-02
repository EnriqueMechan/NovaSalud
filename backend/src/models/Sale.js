const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Sale = sequelize.define("Sale", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  cliente: { type: DataTypes.STRING },
  UserId: { type: DataTypes.INTEGER },
});

module.exports = Sale;