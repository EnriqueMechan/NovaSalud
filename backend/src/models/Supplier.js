const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Supplier = sequelize.define("Supplier", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  contacto: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  direccion: { type: DataTypes.STRING },
});

module.exports = Supplier;