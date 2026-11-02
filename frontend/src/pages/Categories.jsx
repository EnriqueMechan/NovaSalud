import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Icon, { categoryIcon } from "../components/Icon";
import emptyList from "../assets/ill-empty-list.svg";

export default function Categories() {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const [items, setItems] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const load = async () => { const r = await api.get("/categories"); setItems(r.data); };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/categories", { nombre, descripcion });
    setNombre(""); setDescripcion(""); load();
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar categoría?")) return;
    await api.delete(`/categories/${id}`); load();
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 className="page-title">Categorías</h2>
          <p className="page-sub">Organización de productos por categoría.</p>
        </div>
        <span className="badge badge-brand">
          <Icon name="tag" size={13} />
          <span style={{ marginLeft: 5 }}>{items.length} categoría(s)</span>
        </span>
      </div>

      {isAdmin && (
        <div className="panel">
          <div className="panel-head">
            <h3 className="panel-title">
              <span className="section-icon"><Icon name="plus" size={16} /></span>
              Nueva categoría
            </h3>
          </div>
          <form onSubmit={submit} className="form-grid">
            <div className="field">
              <label>Nombre</label>
              <input className="input" placeholder="Nombre de la categoría" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="field">
              <label>Descripción</label>
              <input className="input" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <button className="btn btn-primary" type="submit">
                <Icon name="plus" size={15} />
                Agregar categoría
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Categoría</th><th>Descripción</th>{isAdmin && <th>Acciones</th>}</tr></thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 3 : 2}>
                    <div className="empty-art">
                      <img src={emptyList} alt="" />
                      <span className="empty-title">Sin categorías</span>
                      <span className="empty-hint">Crea categorías para agrupar el catálogo por tipo de producto.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((c) => {
                  const cat = categoryIcon(c.nombre);
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="cell-with-thumb">
                          <span className={`thumb thumb-${cat.tone}`}><Icon name={cat.icon} size={17} /></span>
                          <span className="cell-title">{c.nombre}</span>
                        </div>
                      </td>
                      <td>{c.descripcion || "—"}</td>
                      {isAdmin && (
                        <td className="actions">
                          <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>
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
      </div>
    </div>
  );
}
