import { useEffect, useState } from "react";
import api from "../api";

export default function Alerts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/products/low-stock")
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <h2 className="page-title">Alertas de stock bajo</h2>
        <p className="page-sub">
          Productos que requieren reposición (stock ≤ stock mínimo).
        </p>
      </div>

      {items.length > 0 ? (
        <div className="alert-box warn" role="status">
          <strong>¡Atención!</strong> Hay{" "}
          <strong>{items.length}</strong> producto(s) con stock bajo o agotado.
        </div>
      ) : (
        <div className="alert-box" style={{ background: "#DCFCE7", borderColor: "#15803d", color: "#15803d" }}>
          <strong>Todo en orden:</strong> no hay alertas de stock bajo.
        </div>
      )}

      <div className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Categoría</th>
                <th>Proveedor</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">Sin alertas de stock bajo.</td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="low-stock-row">
                    <td>{p.nombre}</td>
                    <td>{p.codigo}</td>
                    <td>{p.stock}</td>
                    <td>{p.stockMinimo}</td>
                    <td>{p.Category?.nombre || "—"}</td>
                    <td>{p.Supplier?.nombre || "—"}</td>
                    <td>
                      <span className="badge badge-low">Stock bajo</span>
                    </td>
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
