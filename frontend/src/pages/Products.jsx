import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const ICONS = {
  add: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  delete: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
};

export default function Products() {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    nombre: "", codigo: "", precio: "", stock: "", stockMinimo: 5, CategoryId: "", SupplierId: "",
  });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [p, c, s] = await Promise.all([
      api.get("/products"), api.get("/categories"), api.get("/suppliers"),
    ]);
    setProducts(p.data); setCategories(c.data); setSuppliers(s.data);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ nombre: "", codigo: "", precio: "", stock: "", stockMinimo: 5, CategoryId: "", SupplierId: "" });
    setEditing(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form, precio: Number(form.precio), stock: Number(form.stock),
      stockMinimo: Number(form.stockMinimo), CategoryId: form.CategoryId || null,
      SupplierId: form.SupplierId || null,
    };
    if (editing) await api.put(`/products/${editing}`, payload);
    else await api.post("/products", payload);
    resetForm(); load();
  };

  const edit = (p) => {
    setEditing(p.id);
    setForm({ nombre: p.nombre, codigo: p.codigo || "", precio: p.precio, stock: p.stock, stockMinimo: p.stockMinimo, CategoryId: p.CategoryId || "", SupplierId: p.SupplierId || "" });
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    await api.delete(`/products/${id}`); load();
  };

  const low = (p) => p.stock <= p.stockMinimo;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Productos</h2>
          <p className="page-sub">Catálogo de productos de la botica con control de stock.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => (editing ? resetForm() : null)}>
            {editing ? "Cancelar" : "Nuevo producto"}
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="panel">
          <form onSubmit={submit} className="form-grid">
            <div className="field">
              <label>Nombre</label>
              <input className="input" placeholder="Nombre del producto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="field">
              <label>Código</label>
              <input className="input" placeholder="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
            </div>
            <div className="field">
              <label>Precio</label>
              <input className="input" type="number" step="0.01" placeholder="0.00" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
            </div>
            <div className="field">
              <label>Stock</label>
              <input className="input" type="number" placeholder="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
            <div className="field">
              <label>Stock mínimo</label>
              <input className="input" type="number" placeholder="5" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })} />
            </div>
            <div className="field">
              <label>Categoría</label>
              <select className="select" value={form.CategoryId} onChange={(e) => setForm({ ...form, CategoryId: e.target.value })}>
                <option value="">Categoría</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Proveedor</label>
              <select className="select" value={form.SupplierId} onChange={(e) => setForm({ ...form, SupplierId: e.target.value })}>
                <option value="">Proveedor</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <button className="btn btn-primary" type="submit" dangerouslySetInnerHTML={{ __html: `${ICONS.add}<span style="margin-left:6px">{editing ? "Actualizar producto" : "Agregar producto"}</span>` }} />
              {editing && <button className="btn btn-ghost" type="button" onClick={resetForm}>Cancelar</button>}
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th><th>Código</th><th>Precio</th><th>Stock</th><th>Mín.</th><th>Categoría</th><th>Proveedor</th>{isAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={isAdmin ? 8 : 7} className="empty">Sin productos registrados.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className={low(p) ? "low-stock-row" : undefined}>
                    <td>{p.nombre}</td><td>{p.codigo}</td><td>{Number(p.precio || 0).toFixed(2)}</td><td>{p.stock}</td><td>{p.stockMinimo}</td><td>{p.Category?.nombre || "—"}</td><td>{p.Supplier?.nombre || "—"}</td>
                    {isAdmin && (
                      <td className="actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => edit(p)} dangerouslySetInnerHTML={{ __html: `${ICONS.edit}<span style="margin-left:4px">Editar</span>` }} />
                        <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)} dangerouslySetInnerHTML={{ __html: `${ICONS.delete}<span style="margin-left:4px">Eliminar</span>` }} />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {products.some(low) && (
          <p className="page-sub"><span className="badge badge-low">Stock bajo</span> filas resaltadas: requieren reposición.</p>
        )}
      </div>
    </div>
  );
}
