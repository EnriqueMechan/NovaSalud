import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroImg from "../assets/hero.png";

const ICONS = {
  dashboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" ry="1"/><rect x="14" y="3" width="7" height="7" rx="1" ry="1"/><rect x="14" y="14" width="7" height="7" rx="1" ry="1"/><rect x="3" y="14" width="7" height="7" rx="1" ry="1"/></svg>`,
  products: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 21h22l2-6 6-12"/><path d="M19 10v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/></svg>`,
  sales: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  alerts: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v4"/><path d="M21 12a9 9 0 1 1-6.24-1.76"/><circle cx="12" cy="8" r="1"/></svg>`,
  categories: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.66.66a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.66-.66a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2z"/></svg>`,
  suppliers: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  logout: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  if (!user) return null;
  const rolLabel = user.rol === "admin" ? "Administrador" : "Vendedor";

  const navItems = [
    { to: "/", label: "Dashboard", key: "dashboard" },
    { to: "/products", label: "Productos", key: "products" },
    { to: "/sales", label: "Ventas", key: "sales" },
    { to: "/alerts", label: "Alertas", key: "alerts" },
    { to: "/categories", label: "Categorías", key: "categories" },
    { to: "/suppliers", label: "Proveedores", key: "suppliers" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link
          to="/"
          className="brand"
          onClick={(e) => {
            if (window.location.pathname === "/") e.preventDefault();
            navigate("/");
          }}
        >
          <img src={heroImg} alt="Logo Nova Salud" className="mark" />
          Nova Salud
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="btn btn-ghost nav-link"
              style={{ position: "relative" }}
            >
              <span
                dangerouslySetInnerHTML={{ __html: ICONS[item.key] }}
                style={{
                  marginRight: 6,
                  verticalAlign: "middle",
                  color: window.location.pathname === item.to ? "var(--brand)" : "var(--body)",
                }}
              />
              {item.label}
            </Link>
          ))}
        </div>
        <div className="nav-user">
          <div>
            <div style={{ fontWeight: 600, color: "var(--ink)" }}>{user.nombre}</div>
            <div className="role">{rolLabel}</div>
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleLogout}
            dangerouslySetInnerHTML={{
              __html: `${ICONS.logout}<span style="margin-left:4px">Salir</span>`,
            }}
          />
        </div>
      </div>
    </nav>
  );
}
