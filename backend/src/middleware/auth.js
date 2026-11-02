const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(403).json({ message: "Token requerido" });
  const token = header.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token requerido" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token invalido" });
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  });
}

function onlyAdmin(req, res, next) {
  if (req.userRol !== "admin") {
    return res.status(403).json({ message: "Acceso solo para administradores" });
  }
  next();
}

module.exports = { auth, onlyAdmin };