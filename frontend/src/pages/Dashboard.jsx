import { useEffect, useState } from "react";
import api from "../api";

const DASH_ICONS = {
  products: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 21h22l2-6 6-12"/><path d="M19 10v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/></svg>`,
  low: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v4"/><path d="M21 12a9 9 0 1 1-6.24-1.76"/><circle cx="12" cy="8" r="1"/></svg>`,
  sales: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  count: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

const cards = [
  { key: "totalProducts", label: "Productos", cls: "products", icon: DASH_ICONS.products, fmt: (v) => v },
  { key: "lowStock", label: "Stock bajo", cls: "low", icon: DASH_ICONS.low, fmt: (v) => v },
  { key: "totalSales", label: "Ventas totales", cls: "sales", icon: DASH_ICONS.sales, fmt: (v) => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(v || 0) },
  { key: "salesCount", label: "Nro. de ventas", cls: "count", icon: DASH_ICONS.count, fmt: (v) => v },
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
              <span className={`stat-icon ${c.cls}`} dangerouslySetInnerHTML={{ __html: c.icon }} />
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
