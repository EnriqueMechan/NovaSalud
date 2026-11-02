import { useEffect, useState } from "react";
import api from "../api";

export default function Alerts() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/products/low-stock").then((r) => setItems(r.data)).catch(() => {}); }, []);
  return (
    <div style={{ padding: 24 }}>
      <h2>Alertas de stock bajo</h2>
      {items.length === 0 && <p>Sin alertas.</p>}
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead><tr><th>Producto</th><th>Stock</th><th>Minimo</th></tr></thead>
        <tbody>
          {items.map((p) => <tr key={p.id}><td>{p.nombre}</td><td>{p.stock}</td><td>{p.stockMinimo}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}