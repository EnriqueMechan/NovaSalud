import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  if (!user) return null;
  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, background: "#1f2937", color: "#fff", flexWrap: "wrap" }}>
      <strong>Nova Salud</strong>
      <Link to="/" style={{ color: "#fff" }}>Dashboard</Link>
      <Link to="/products" style={{ color: "#fff" }}>Productos</Link>
      <Link to="/sales" style={{ color: "#fff" }}>Ventas</Link>
      <Link to="/alerts" style={{ color: "#fff" }}>Alertas</Link>
      <Link to="/categories" style={{ color: "#fff" }}>Categorias</Link>
      <Link to="/suppliers" style={{ color: "#fff" }}>Proveedores</Link>
      <span style={{ marginLeft: "auto" }}>{user.nombre} ({user.rol})</span>
      <button onClick={handleLogout}>Salir</button>
    </nav>
  );
}