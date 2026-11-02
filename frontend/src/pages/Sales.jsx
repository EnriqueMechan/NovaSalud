import { useEffect, useState } from "react";
import api from "../api";

const ICONS = {
  add: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  delete: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  minus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
};

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [cart, setCart] = useState([]);
  const [cliente, setCliente] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);

  const load = async () => {
    const [p, s] = await Promise.all([api.get("/products"), api.get("/sales")]);
    setProducts(p.data); setSales(s.data);
  };

  useEffect(() => { load(); }, []);

  const addToCart = () => {
    if (!selectedProduct) return;
    const pid = Number(selectedProduct);
    const product = products.find((p) => p.id === pid);
    if (!product) return;
    const existing = cart.find((c) => c.productId === pid);
    if (existing) {
      if (existing.cantidad + Number(qty) > product.stock) return alert("Stock insuficiente");
      setCart(cart.map((c) => c.productId === pid ? { ...c, cantidad: c.cantidad + Number(qty) } : c));
    } else {
      if (Number(qty) > product.stock) return alert("Stock insuficiente");
      setCart([...cart, { productId: pid, cantidad: Number(qty) }]);
    }
    setQty(1);
  };

  const changeQty = (pid, delta) => {
    setCart((prev) => prev.map((c) => c.productId === pid ? { ...c, cantidad: Math.max(0, c.cantidad + delta) } : c).filter((c) => c.cantidad > 0));
  };

  const removeFromCart = (pid) => setCart(cart.filter((c) => c.productId !== pid));

  const cartTotal = cart.reduce((sum, c) => sum + (products.find((p) => p.id === c.productId)?.precio || 0) * c.cantidad, 0);

  const submitSale = async () => {
    if (!cart.length) return alert("Carrito vacío");
    try {
      await api.post("/sales", { cliente, items: cart });
      setCart([]); setCliente(""); setQty(1); load();
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar la venta");
    }
  };

  const productName = (id) => products.find((p) => p.id === id)?.nombre || id;

  return (
    <div className="page">
      <div className="page-head">
        <h2 className="page-title">Ventas</h2>
        <p className="page-sub">Registro de ventas con actualización automática de stock.</p>
      </div>

      <div className="panel">
        <div className="panel-head"><h3 className="panel-title">Nueva venta</h3></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, alignItems: "end" }}>
          <div className="field">
            <label>Producto</label>
            <select className="select" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
              <option value="">Seleccionar producto</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.nombre} (stock {p.stock})</option>)}
            </select>
          </div>
          <div className="field">
            <label>Cantidad</label>
            <input className="input" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>
          <div className="field">
            <label>Cliente</label>
            <input className="input" placeholder="Nombre del cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
          </div>
          <div className="field">
            <button className="btn btn-primary" type="button" onClick={addToCart} dangerouslySetInnerHTML={{ __html: `${ICONS.add}<span style="margin-left:6px">Agregar al carrito</span>` }} />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3 className="panel-title">Carrito</h3></div>
        {cart.length === 0 ? (
          <div className="empty">El carrito está vacío.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cart.map((c) => {
              const p = products.find((pd) => pd.id === c.productId);
              const price = p ? Number(p.precio || 0) : 0;
              return (
                <div key={c.productId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "8px", background: "#fff" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}><strong>{p ? p.nombre : id}</strong></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => changeQty(c.productId, -1)} dangerouslySetInnerHTML={{ __html: ICONS.minus }} />
                    <span style={{ minWidth: 22, textAlign: "center" }}>{c.cantidad}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => changeQty(c.productId, 1)} dangerouslySetInnerHTML={{ __html: ICONS.plus }} />
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(c.productId)} dangerouslySetInnerHTML={{ __html: ICONS.delete }} />
                  </div>
                  <span>{new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(price * c.cantidad)}</span>
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontWeight: 700, color: "var(--ink)", marginRight: 8 }}>Total:</span>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--brand)" }}>{new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(cartTotal)}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={submitSale} disabled={!cart.length}>Registrar venta</button>
              <button className="btn btn-outline" type="button" onClick={() => setCart([])}>Vaciar carrito</button>
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="panel-head"><h3 className="panel-title">Historial de ventas</h3></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Items</th></tr></thead>
            <tbody>
              {sales.length === 0 ? (
                <tr><td colSpan="5" className="empty">Sin ventas registradas.</td></tr>
              ) : (
                sales.map((s) => (
                  <tr key={s.id}>
                    <td>#{s.id}</td><td>{new Date(s.fecha).toLocaleString("es-PE")}</td><td>{s.cliente || "—"}</td><td>{Number(s.total || 0).toFixed(2)}</td><td>{s.items?.map((i) => `${i.Product?.nombre || "?"} x${i.cantidad}`).join(", ")}</td>
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
