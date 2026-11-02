require("dotenv").config();
const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");
const { User, Category, Supplier, Product } = require("../models");

(async () => {
  await sequelize.sync({ force: true });
  console.log("DB reset");

  const adminPass = await bcrypt.hash("admin123", 10);
  await User.create({ nombre: "Administrador", email: "admin@novasalud.com", password: adminPass, rol: "admin" });
  const vendPass = await bcrypt.hash("vendedor123", 10);
  await User.create({ nombre: "Vendedor", email: "vendedor@novasalud.com", password: vendPass, rol: "vendedor" });

  const catMed = await Category.create({ nombre: "Medicamentos", descripcion: "Medicamentos de venta libre y con receta" });
  const catCuidado = await Category.create({ nombre: "Cuidado personal", descripcion: "Productos de higiene y cuidado" });
  const catVitaminas = await Category.create({ nombre: "Vitaminas", descripcion: "Suplementos vitaminicos" });

  const prov1 = await Supplier.create({ nombre: "Distribuidora Farma", contacto: "Juan Perez", telefono: "999111222", email: "farma@proveedor.com" });
  const prov2 = await Supplier.create({ nombre: "Laboratorios Unidos", contacto: "Maria Lopez", telefono: "999333444", email: "lab@proveedor.com" });

  await Product.bulkCreate([
    { nombre: "Paracetamol 500mg", codigo: "P001", precio: 5.5, stock: 100, stockMinimo: 20, CategoryId: catMed.id, SupplierId: prov1.id },
    { nombre: "Ibuprofeno 400mg", codigo: "P002", precio: 7.0, stock: 80, stockMinimo: 15, CategoryId: catMed.id, SupplierId: prov1.id },
    { nombre: "Amoxicilina 500mg", codigo: "P003", precio: 12.5, stock: 40, stockMinimo: 10, CategoryId: catMed.id, SupplierId: prov2.id },
    { nombre: "Vitamina C 1000mg", codigo: "P004", precio: 15.0, stock: 60, stockMinimo: 10, CategoryId: catVitaminas.id, SupplierId: prov2.id },
    { nombre: "Alcohol en gel 250ml", codigo: "P005", precio: 8.0, stock: 4, stockMinimo: 10, CategoryId: catCuidado.id, SupplierId: prov1.id },
    { nombre: "Mascarilla KN95", codigo: "P006", precio: 3.0, stock: 200, stockMinimo: 50, CategoryId: catCuidado.id, SupplierId: prov1.id },
  ]);

  console.log("Seed completado");
  process.exit(0);
})();