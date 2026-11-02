import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@novasalud.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error de login");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
      <h2>Iniciar sesion - Nova Salud</h2>
      <form onSubmit={submit}>
        <div><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: "100%", margin: "8px 0", padding: 8 }} /></div>
        <div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: "100%", margin: "8px 0", padding: 8 }} /></div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "8px 16px" }}>Entrar</button>
      </form>
      <p style={{ fontSize: 12, color: "#666" }}>admin@novasalud.com / admin123</p>
    </div>
  );
}