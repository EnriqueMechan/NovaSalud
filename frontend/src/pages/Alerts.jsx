import { useEffect, useState } from "react";
import api from "../api";

const ICONS = {
  alert: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v4"/><path d="M21 12a9 9 0 1 1-6.24-1.76"/><circle cx="12" cy="8" r="1"/></svg>`,
  ok: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
};

export default function Alerts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/products/low-stock").then((r) => setItems(r.data || [])).catch(() => setItems([]));
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <h2 className="page-title">Alertas de stock bajo</h2>
        <p className="page-sub">Productos que requieren reposición (stock ≤ stock mínimo).</p>
      </div>

      {items.length > 0 ? (
        <div className="alert-box warn" role="status" dangerouslySetInnerHTML={{ __html: `${ICONS.alert}<strong>¡Atención!</strong> Hay <strong>${items.length}</strong> producto(s) con stock bajo o agotado.` }} />
      ) : (
        <div className="alert-box" style={{ background: "#D1FAE5", borderColor: "#10B981", color: "#065F46" }} dangerouslySetInnerHTML={{ __html: `${ICONS.ok}<strong>Todo en orden:</strong> no hay alertas de stock bajo.` }} />
      )}

      <div className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Producto</th><th>Código</th><th>Stock</th><th>Mínimo</th><th>Categoría</th><th>Proveedor</th><th>Estado</th></tr></thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan="7" className="empty">Sin alertas de stock bajo.</td></tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="low-stock-row">
                    <td>{p.nombre}</td><td>{p.codigo}</td><td>{p.stock}</td><td>{p.stockMinimo}</td><td>{p.Category?.nombre || "—"}</td><td>{p.Supplier?.nombre || "—"}</td><td><span className="badge badge-low">Stock bajo</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
