import { useEffect, useState } from "react";
import api from "../api";
import Icon, { categoryIcon } from "../components/Icon";
import noAlerts from "../assets/ill-no-alerts.svg";

export default function Alerts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/products/low-stock").then((r) => setItems(r.data || [])).catch(() => setItems([]));
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Alertas de stock bajo</h2>
          <p className="page-sub">Productos que requieren reposición (stock ≤ stock mínimo).</p>
        </div>
        <span className={`badge ${items.length ? "badge-low" : "badge-ok"}`}>
          <Icon name={items.length ? "alert" : "checkCircle"} size={13} />
          <span style={{ marginLeft: 5 }}>{items.length ? `${items.length} por reponer` : "Sin alertas"}</span>
        </span>
      </div>

      {items.length > 0 ? (
        <div className="alert-box warn" role="status">
          <Icon name="alert" size={18} />
          <span>
            <strong>¡Atención!</strong> Hay <strong>{items.length}</strong> producto(s) con stock bajo o agotado.
          </span>
        </div>
      ) : (
        <div className="alert-box" style={{ background: "#D1FAE5", borderColor: "#10B981", color: "#065F46" }}>
          <Icon name="checkCircle" size={18} />
          <span><strong>Todo en orden:</strong> no hay alertas de stock bajo.</span>
        </div>
      )}

      <div className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Producto</th><th>Código</th><th>Stock</th><th>Mínimo</th><th>Categoría</th><th>Proveedor</th><th>Estado</th></tr></thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-art">
                      <img src={noAlerts} alt="" />
                      <span className="empty-title">Inventario saludable</span>
                      <span className="empty-hint">Ningún producto cayó por debajo de su stock mínimo configurado.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((p) => {
                  const cat = categoryIcon(p.Category?.nombre);
                  return (
                    <tr key={p.id} className="low-stock-row">
                      <td>
                        <div className="cell-with-thumb">
                          <span className={`thumb thumb-${cat.tone}`}><Icon name={cat.icon} size={17} /></span>
                          <span className="cell-title">{p.nombre}</span>
                        </div>
                      </td>
                      <td>{p.codigo}</td>
                      <td><strong style={{ color: "var(--accent)" }}>{p.stock}</strong></td>
                      <td>{p.stockMinimo}</td>
                      <td>{p.Category?.nombre || "—"}</td>
                      <td>{p.Supplier?.nombre || "—"}</td>
                      <td>
                        <span className="badge badge-low">
                          <Icon name="alert" size={12} />
                          <span style={{ marginLeft: 5 }}>Stock bajo</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
