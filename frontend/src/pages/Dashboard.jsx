import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Icon from "../components/Icon";

const pen = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

const cards = [
  { key: "totalProducts", label: "Productos", icon: "box", tone: "thumb-brand", hint: "en catálogo" },
  { key: "lowStock", label: "Stock bajo", icon: "alert", tone: "thumb-red", hint: "por reponer" },
  { key: "totalSales", label: "Ventas totales", icon: "coins", tone: "thumb-violet", hint: "acumulado", fmt: (v) => pen.format(v || 0) },
  { key: "salesCount", label: "Nro. de ventas", icon: "receipt", tone: "thumb-slate", hint: "registradas" },
];

const quickActions = [
  { to: "/sales", icon: "cart", title: "Registrar venta", sub: "Punto de venta con stock validado" },
  { to: "/alerts", icon: "bell", title: "Ver alertas", sub: "Productos que piden reposición" },
  { to: "/products", icon: "box", title: "Gestionar inventario", sub: "Altas, ediciones y catálogo" },
  { to: "/suppliers", icon: "truck", title: "Proveedores", sub: "Contactos para reponer" },
];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/summary")
      .then((r) => setData(r.data))
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="page">
        <div className="panel">
          <h2 className="panel-title"><Icon name="chart" size={18} /> Dashboard</h2>
          <div className="empty-art">
            <Icon name="refresh" size={26} className="spin" />
            <span className="empty-title">Cargando indicadores…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-sub">
            Resumen del inventario y las ventas de la botica Nova Salud.
          </p>
        </div>
        <span className="badge badge-brand">
          <Icon name="clock" size={13} />
          <span style={{ marginLeft: 6 }}>Hoy: {data.todaySales || 0} ventas · {pen.format(data.todayTotal || 0)}</span>
        </span>
      </div>

      {data.lowStock > 0 && (
        <div className="alert-box warn" role="status">
          <Icon name="alert" size={18} />
          <span>
            <strong>{data.lowStock}</strong> producto(s) alcanzaron su stock mínimo y
            requieren reposición.
          </span>
          <Link to="/alerts" className="btn btn-sm btn-outline" style={{ marginLeft: "auto" }}>
            Ver alertas
            <Icon name="arrowRight" size={14} />
          </Link>
        </div>
      )}

      <div className="stats">
        {cards.map((c) => {
          const value = data[c.key] == null ? 0 : data[c.key];
          return (
            <div className="stat-card" key={c.key}>
              <span className={`stat-icon thumb ${c.tone}`}>
                <Icon name={c.icon} size={22} strokeWidth={2.2} />
              </span>
              <div>
                <div className="stat-label">{c.label}</div>
                <div className="stat-value">{c.fmt ? c.fmt(value) : value}</div>
                <div className="stat-hint">{c.hint}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3 className="panel-title">
            <span className="section-icon"><Icon name="trend" size={16} /></span>
            Accesos rápidos
          </h3>
        </div>
        <div className="quick-grid">
          {quickActions.map((a) => (
            <Link to={a.to} className="quick-item" key={a.to + a.title}>
              <span className="thumb thumb-brand"><Icon name={a.icon} size={18} /></span>
              <span className="quick-text">
                <span className="quick-title">{a.title}</span>
                <span className="quick-sub">{a.sub}</span>
              </span>
              <Icon name="arrowRight" size={16} className="arrow" />
            </Link>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3 className="panel-title">
            <span className="section-icon"><Icon name="info" size={16} /></span>
            Estado rápido
          </h3>
        </div>
        <p className="page-sub">
          El sistema centraliza el inventario, las ventas y la atención al
          cliente. Usa <strong>Alertas</strong> para revisar productos con
          stock bajo y reponerlos a tiempo.
        </p>
      </div>
    </div>
  );
}
