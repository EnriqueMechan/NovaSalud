const User = require("./User");
const Category = require("./Category");
const Supplier = require("./Supplier");
const Product = require("./Product");
const Sale = require("./Sale");
const SaleItem = require("./SaleItem");

// Associations
Category.hasMany(Product, { foreignKey: "CategoryId" });
Product.belongsTo(Category, { foreignKey: "CategoryId" });

Supplier.hasMany(Product, { foreignKey: "SupplierId" });
Product.belongsTo(Supplier, { foreignKey: "SupplierId" });

User.hasMany(Sale, { foreignKey: "UserId" });
Sale.belongsTo(User, { foreignKey: "UserId" });

Sale.hasMany(SaleItem, { foreignKey: "SaleId", as: "items", onDelete: "CASCADE" });
SaleItem.belongsTo(Sale, { foreignKey: "SaleId" });

Product.hasMany(SaleItem, { foreignKey: "ProductId" });
SaleItem.belongsTo(Product, { foreignKey: "ProductId" });

module.exports = { User, Category, Supplier, Product, Sale, SaleItem };