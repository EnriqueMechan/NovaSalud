import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Icon, { categoryIcon } from "../components/Icon";
import emptyList from "../assets/ill-empty-list.svg";

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
            <Icon name={editing ? "close" : "plus"} size={15} />
            {editing ? "Cancelar edición" : "Nuevo producto"}
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="panel">
          <div className="panel-head">
            <h3 className="panel-title">
              <span className="section-icon"><Icon name={editing ? "edit" : "plus"} size={16} /></span>
              {editing ? "Editar producto" : "Registrar producto"}
            </h3>
          </div>
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
              <button className="btn btn-primary" type="submit">
                <Icon name={editing ? "check" : "plus"} size={15} />
                {editing ? "Actualizar producto" : "Agregar producto"}
              </button>
              {editing && (
                <button className="btn btn-ghost" type="button" onClick={resetForm} style={{ marginLeft: 8 }}>
                  <Icon name="close" size={15} />
                  Descartar
                </button>
              )}
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
                <tr>
                  <td colSpan={isAdmin ? 8 : 7}>
                    <div className="empty-art">
                      <img src={emptyList} alt="" />
                      <span className="empty-title">Aún no hay productos</span>
                      <span className="empty-hint">Registra el primer artículo del catálogo para empezar a controlar el stock.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const cat = categoryIcon(p.Category?.nombre);
                  return (
                    <tr key={p.id} className={low(p) ? "low-stock-row" : undefined}>
                      <td>
                        <div className="cell-with-thumb">
                          <span className={`thumb thumb-${cat.tone}`}><Icon name={cat.icon} size={17} /></span>
                          <span>
                            <span className="cell-title">{p.nombre}</span>
                            {low(p) && <span className="cell-meta"> · requiere reposición</span>}
                          </span>
                        </div>
                      </td>
                      <td>{p.codigo}</td>
                      <td>{Number(p.precio || 0).toFixed(2)}</td>
                      <td>{low(p) ? <strong style={{ color: "var(--accent)" }}>{p.stock}</strong> : p.stock}</td>
                      <td>{p.stockMinimo}</td>
                      <td>{p.Category?.nombre || "—"}</td>
                      <td>{p.Supplier?.nombre || "—"}</td>
                      {isAdmin && (
                        <td className="actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => edit(p)}>
                            <Icon name="edit" size={14} />
                            Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>
                            <Icon name="trash" size={14} />
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {products.some(low) && (
          <p className="page-sub">
            <span className="badge badge-low">
              <Icon name="alert" size={12} />
              <span style={{ marginLeft: 5 }}>Stock bajo</span>
            </span>{" "}
            filas resaltadas: requieren reposición.
          </p>
        )}
      </div>
    </div>
  );
}
