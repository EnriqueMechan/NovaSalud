import { useEffect, useState } from "react";
import api from "../api";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [cart, setCart] = useState([]); // {productId, cantidad}
  const [cliente, setCliente] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);

  const load = async () => {
    const [p, s] = await Promise.all([api.get("/products"), api.get("/sales")]);
    setProducts(p.data);
    setSales(s.data);
  };

  useEffect(() => { load(); }, []);

  const addToCart = () => {
    if (!selectedProduct) return;
    const existing = cart.find((c) => c.productId === Number(selectedProduct));
    if (existing) {
      setCart(cart.map((c) => c.productId === Number(selectedProduct) ? { ...c, cantidad: c.cantidad + Number(qty) } : c));
    } else {
      setCart([...cart, { productId: Number(selectedProduct), cantidad: Number(qty) }]);
    }
    setQty(1);
  };

  const removeFromCart = (pid) => setCart(cart.filter((c) => c.productId !== pid));

  const submitSale = async () => {
    if (!cart.length) return alert("Carrito vacio");
    try {
      await api.post("/sales", { cliente, items: cart });
      setCart([]);
      setCliente("");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const productName = (id) => products.find((p) => p.id === id)?.nombre || id;

  return (
    <div style={{ padding: 24 }}>
      <h2>Ventas</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
          <option value="">Producto</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.nombre} (stock {p.stock})</option>)}
        </select>
        <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} style={{ width: 80 }} />
        <button onClick={addToCart}>Agregar</button>
        <input placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        <button onClick={submitSale}>Registrar venta</button>
      </div>

      <h3>Carrito</h3>
      <ul>
        {cart.map((c) => (
          <li key={c.productId}>
            {productName(c.productId)} x {c.cantidad}
            <button onClick={() => removeFromCart(c.productId)} style={{ marginLeft: 8 }}>x</button>
          </li>
        ))}
      </ul>

      <h3>Historial de ventas</h3>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Items</th></tr></thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{new Date(s.fecha).toLocaleString()}</td>
              <td>{s.cliente || "-"}</td>
              <td>{Number(s.total).toFixed(2)}</td>
              <td>{s.items?.map((i) => `${i.Product?.nombre} x${i.cantidad}`).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}