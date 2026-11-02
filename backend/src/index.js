require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const { auth } = require("./middleware/auth");
const { User, Category, Supplier, Product } = require("./models");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/products", require("./routes/productRoutes"));
app.use("/api/v1/categories", require("./routes/categoryRoutes"));
app.use("/api/v1/suppliers", require("./routes/supplierRoutes"));
app.use("/api/v1/sales", require("./routes/saleRoutes"));
app.use("/api/v1/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => res.json({ message: "Nova Salud API", version: "1.0.0" }));

const PORT = process.env.PORT || 4000;

/**
 * Carga datos por defecto si la base de datos esta vacia.
 * Permite que el lanzador general funcione sin ejecutar pasos manuales.
 */
async function seedDefaultData() {
  const userCount = await User.count();
  if (userCount > 0) return;

  console.log("Cargando datos por defecto...");

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

  console.log("Datos por defecto cargados.");
}

(async () => {
  try {
    await sequelize.sync();
    console.log("DB sincronizada");
    await seedDefaultData();
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (e) {
    console.error("Error al iniciar:", e);
    process.exit(1);
  }
})();