import { useEffect, useState } from "react";
import api from "../api";

const cards = [
  {
    key: "totalProducts",
    label: "Productos",
    icon: "📦",
    cls: "products",
    fmt: (v) => v,
  },
  {
    key: "lowStock",
    label: "Stock bajo",
    icon: "⚠️",
    cls: "low",
    fmt: (v) => v,
  },
  {
    key: "totalSales",
    label: "Ventas totales",
    icon: "💰",
    cls: "sales",
    fmt: (v) => new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(v || 0),
  },
  {
    key: "salesCount",
    label: "Nro. de ventas",
    icon: "🧾",
    cls: "count",
    fmt: (v) => v,
  },
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
          <h2 className="panel-title">Dashboard</h2>
          <div className="empty">Cargando…</div>
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
      </div>

      <div className="stats">
        {cards.map((c) => {
          const value = data[c.key] == null ? 0 : data[c.key];
          return (
            <div className="stat-card" key={c.key}>
              <span className={`stat-icon ${c.cls}`}>{c.icon}</span>
              <div>
                <div className="stat-label">{c.label}</div>
                <div className="stat-value">{c.fmt(value)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3 className="panel-title">Estado rápido</h3>
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
