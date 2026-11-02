import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/summary").then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div>Cargando...</div>;

  const card = (label, value) => (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, minWidth: 150 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: "bold" }}>{value}</div>
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {card("Productos", data.totalProducts)}
        {card("Stock bajo", data.lowStock)}
        {card("Ventas totales", data.totalSales.toFixed(2))}
        {card("Nro. ventas", data.salesCount)}
        {card("Ventas hoy", data.todaySales)}
        {card("Total hoy", data.todayTotal.toFixed(2))}
      </div>
    </div>
  );
}