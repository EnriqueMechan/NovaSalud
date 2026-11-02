const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SaleItem = sequelize.define("SaleItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precioUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  ProductId: { type: DataTypes.INTEGER },
  SaleId: { type: DataTypes.INTEGER },
});

module.exports = SaleItem;