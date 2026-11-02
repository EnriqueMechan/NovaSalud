import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

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
    setNombre(""); setDescripcion("");
    load();
  };

  const remove = async (id) => { await api.delete(`/categories/${id}`); load(); };

  return (
    <div style={{ padding: 24 }}>
      <h2>Categorias</h2>
      {isAdmin && (
        <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input placeholder="Descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <button type="submit">Agregar</button>
        </form>
      )}
      <ul>
        {items.map((c) => (
          <li key={c.id}>{c.nombre} - {c.descripcion} {isAdmin && <button onClick={() => remove(c.id)}>Eliminar</button>}</li>
        ))}
      </ul>
    </div>
  );
}