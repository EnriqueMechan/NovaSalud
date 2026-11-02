import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import emptyList from "../assets/ill-empty-list.svg";

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
        <div>
          <h2 className="page-title">Proveedores</h2>
          <p className="page-sub">Gestión de proveedores de la botica.</p>
        </div>
        <span className="badge badge-brand">
          <Icon name="truck" size={13} />
          <span style={{ marginLeft: 5 }}>{items.length} proveedor(es)</span>
        </span>
      </div>

      {isAdmin && (
        <div className="panel">
          <div className="panel-head">
            <h3 className="panel-title">
              <span className="section-icon"><Icon name="plus" size={16} /></span>
              Nuevo proveedor
            </h3>
          </div>
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
              <button className="btn btn-primary" type="submit">
                <Icon name="plus" size={15} />
                Agregar proveedor
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Proveedor</th><th>Contacto</th>{isAdmin && <th>Acciones</th>}</tr></thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 3 : 2}>
                    <div className="empty-art">
                      <img src={emptyList} alt="" />
                      <span className="empty-title">Sin proveedores registrados</span>
                      <span className="empty-hint">Registra las droguerías para saber a quién reponer cuando salta una alerta.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="cell-with-thumb">
                        <span className="thumb thumb-sky"><Icon name="store" size={17} /></span>
                        <span>
                          <span className="cell-title">{s.nombre}</span>
                          {s.direccion && <span className="cell-meta"><Icon name="pin" size={11} /> {s.direccion}</span>}
                        </span>
                      </div>
                    </td>
                    <td>
                      {s.contacto && <div className="contact-line"><Icon name="user" size={13} />{s.contacto}</div>}
                      {s.telefono && <div className="contact-line"><Icon name="phone" size={13} />{s.telefono}</div>}
                      {s.email && <div className="contact-line"><Icon name="mail" size={13} />{s.email}</div>}
                      {!s.contacto && !s.telefono && !s.email && "—"}
                    </td>
                    {isAdmin && (
                      <td className="actions">
                        <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>
                          <Icon name="trash" size={14} />
                          Eliminar
                        </button>
                      </td>
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
