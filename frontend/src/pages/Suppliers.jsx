import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const ICONS = {
  add: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  delete: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
};

export default function Suppliers() {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nombre: "", contacto: "", telefono: "", email: "", direccion: "" });

  const load = async () => { const r = await api.get("/suppliers"); setItems(r.data); };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/suppliers", form);
    setForm({ nombre: "", contacto: "", telefono: "", email: "", direccion: "" });
    load();
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar proveedor?")) return;
    await api.delete(`/suppliers/${id}`); load();
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2 className="page-title">Proveedores</h2>
        <p className="page-sub">Gestión de proveedores de la botica.</p>
      </div>

      {isAdmin && (
        <div className="panel">
          <form onSubmit={submit} className="form-grid">
            <div className="field">
              <label>Nombre</label>
              <input className="input" placeholder="Nombre del proveedor" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div className="field">
              <label>Contacto</label>
              <input className="input" placeholder="Persona de contacto" value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input className="input" placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input className="input" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Dirección</label>
              <input className="input" placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <button className="btn btn-primary" type="submit" dangerouslySetInnerHTML={{ __html: `${ICONS.add}<span style="margin-left:6px">Agregar proveedor</span>` }} />
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Nombre</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Dirección</th>{isAdmin && <th>Acciones</th>}</tr></thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={isAdmin ? 6 : 5} className="empty">Sin proveedores registrados.</td></tr>
              ) : (
                items.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nombre}</td><td>{s.contacto || "—"}</td><td>{s.telefono || "—"}</td><td>{s.email || "—"}</td><td>{s.direccion || "—"}</td>{isAdmin && (
                      <td className="actions"><button className="btn btn-danger btn-sm" onClick={() => remove(s.id)} dangerouslySetInnerHTML={{ __html: `${ICONS.delete}<span style="margin-left:4px">Eliminar</span>` }} /></td>
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
