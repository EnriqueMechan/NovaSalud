import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const ICONS = {
  add: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  delete: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
};

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
        <h2 className="page-title">Categorías</h2>
        <p className="page-sub">Organización de productos por categoría.</p>
      </div>

      {isAdmin && (
        <div className="panel">
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
              <button className="btn btn-primary" type="submit" dangerouslySetInnerHTML={{ __html: `${ICONS.add}<span style="margin-left:6px">Agregar categoría</span>` }} />
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
                <tr><td colSpan={isAdmin ? 3 : 2} className="empty">Sin categorías registradas.</td></tr>
              ) : (
                items.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nombre}</td><td>{c.descripcion || "—"}</td>{isAdmin && (
                      <td className="actions"><button className="btn btn-danger btn-sm" onClick={() => remove(c.id)} dangerouslySetInnerHTML={{ __html: `${ICONS.delete}<span style="margin-left:4px">Eliminar</span>` }} /></td>
                    )}
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
