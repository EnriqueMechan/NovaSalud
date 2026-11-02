import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";
import logo from "../assets/logo.svg";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/products", label: "Productos", icon: "box" },
  { to: "/sales", label: "Ventas", icon: "cash" },
  { to: "/alerts", label: "Alertas", icon: "alert" },
  { to: "/categories", label: "Categorías", icon: "tag" },
  { to: "/suppliers", label: "Proveedores", icon: "truck" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  const rolLabel = user.rol === "admin" ? "Administrador" : "Vendedor";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <img src={logo} alt="Logo Nova Salud" className="brand-mark" />
          Nova Salud
        </Link>

        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `btn btn-ghost nav-link${isActive ? " active" : ""}`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-user">
          <span className="thumb thumb-brand" style={{ width: 32, height: 32 }}>
            <Icon name={user.rol === "admin" ? "shield" : "user"} size={16} />
          </span>
          <div>
            <div style={{ fontWeight: 600, color: "var(--ink)" }}>{user.nombre}</div>
            <div className="role">{rolLabel}</div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            <Icon name="logout" size={14} />
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
