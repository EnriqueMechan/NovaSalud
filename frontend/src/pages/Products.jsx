import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Products() {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ nombre: "", codigo: "", precio: "", stock: "", stockMinimo: 5, CategoryId: "", SupplierId: "" });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [p, c, s] = await Promise.all([api.get("/products"), api.get("/categories"), api.get("/suppliers")]);
    setProducts(p.data);
    setCategories(c.data);
    setSuppliers(s.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, precio: Number(form.precio), stock: Number(form.stock), stockMinimo: Number(form.stockMinimo), CategoryId: form.CategoryId || null, SupplierId: form.SupplierId || null };
    if (editing) await api.put(`/products/${editing}`, payload);
    else await api.post("/products", payload);
    setForm({ nombre: "", codigo: "", precio: "", stock: "", stockMinimo: 5, CategoryId: "", SupplierId: "" });
    setEditing(null);
    load();
  };

  const edit = (p) => {
    setEditing(p.id);
    setForm({ nombre: p.nombre, codigo: p.codigo || "", precio: p.precio, stock: p.stock, stockMinimo: p.stockMinimo, CategoryId: p.CategoryId || "", SupplierId: p.SupplierId || "" });
  };

  const remove = async (id) => {
    if (!confirm("Eliminar producto?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Productos</h2>
      {isAdmin && (
        <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <input placeholder="Codigo" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
          <input placeholder="Precio" type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
          <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          <input placeholder="Stock min" type="number" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} />
          <select value={form.CategoryId} onChange={(e) => setForm({ ...form, CategoryId: e.target.value })}>
            <option value="">Categoria</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <select value={form.SupplierId} onChange={(e) => setForm({ ...form, SupplierId: e.target.value })}>
            <option value="">Proveedor</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
          <button type="submit">{editing ? "Actualizar" : "Agregar"}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ nombre: "", codigo: "", precio: "", stock: "", stockMinimo: 5, CategoryId: "", SupplierId: "" }); }}>Cancelar</button>}
        </form>
      )}
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead><tr><th>Nombre</th><th>Codigo</th><th>Precio</th><th>Stock</th><th>Min</th><th>Categoria</th><th>Proveedor</th>{isAdmin && <th>Acciones</th>}</tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ background: p.stock <= p.stockMinimo ? "#fee" : "transparent" }}>
              <td>{p.nombre}</td><td>{p.codigo}</td><td>{Number(p.precio).toFixed(2)}</td><td>{p.stock}</td><td>{p.stockMinimo}</td><td>{p.Category?.nombre}</td><td>{p.Supplier?.nombre}</td>
              {isAdmin && <td><button onClick={() => edit(p)}>Editar</button> <button onClick={() => remove(p.id)}>Eliminar</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}