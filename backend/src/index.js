require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require("./config/db");
const { auth } = require("./middleware/auth");

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

(async () => {
  try {
    await sequelize.sync();
    console.log("DB sincronizada");
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (e) {
    console.error("Error al iniciar:", e);
    process.exit(1);
  }
})();