const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.STRING },
  codigo: { type: DataTypes.STRING, unique: true },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  stockMinimo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
  fechaVencimiento: { type: DataTypes.DATEONLY },
  CategoryId: { type: DataTypes.INTEGER },
  SupplierId: { type: DataTypes.INTEGER },
});

module.exports = Product;