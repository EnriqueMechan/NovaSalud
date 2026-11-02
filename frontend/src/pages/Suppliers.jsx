import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

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

  const remove = async (id) => { await api.delete(`/suppliers/${id}`); load(); };

  return (
    <div style={{ padding: 24 }}>
      <h2>Proveedores</h2>
      {isAdmin && (
        <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <input placeholder="Contacto" value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} />
          <input placeholder="Telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Direccion" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
          <button type="submit">Agregar</button>
        </form>
      )}
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead><tr><th>Nombre</th><th>Contacto</th><th>Telefono</th><th>Email</th><th>Direccion</th>{isAdmin && <th>Acciones</th>}</tr></thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}><td>{s.nombre}</td><td>{s.contacto}</td><td>{s.telefono}</td><td>{s.email}</td><td>{s.direccion}</td>{isAdmin && <td><button onClick={() => remove(s.id)}>Eliminar</button></td>}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}