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
  const rolLabel = user.rol === "admin" ? "Administrador" : "Vendedor";
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={(e) => {
          if (window.location.pathname === "/") e.preventDefault();
          navigate("/");
        }}>
          <span className="mark">NS</span> Nova Salud
        </Link>
        <div className="nav-links">
          <Link to="/" className="btn btn-ghost">Dashboard</Link>
          <Link to="/products" className="btn btn-ghost">Productos</Link>
          <Link to="/sales" className="btn btn-ghost">Ventas</Link>
          <Link to="/alerts" className="btn btn-ghost">Alertas</Link>
          <Link to="/categories" className="btn btn-ghost">Categorías</Link>
          <Link to="/suppliers" className="btn btn-ghost">Proveedores</Link>
        </div>
        <div className="nav-user">
          <div>
            <div style={{ fontWeight: 600, color: "var(--ink)" }}>{user.nombre}</div>
            <div className="role">{rolLabel}</div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
