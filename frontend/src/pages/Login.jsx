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
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand">
          <span className="mark">NS</span> Nova Salud
        </div>
        <h2>Iniciar sesión</h2>
        <form onSubmit={submit}>
          <div className="field">
            <label>Correo electrónico</label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@novasalud.com"
              required
            />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <div className="alert-box warn" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}
          <div className="login-actions">
            <button className="btn btn-primary" type="submit">
              Entrar
            </button>
          </div>
        </form>
        <p className="login-hint">
          Prueba con: <code>admin@novasalud.com / admin123</code> o{" "}
          <code>vendedor@novasalud.com / vendedor123</code>
        </p>
      </div>
    </div>
  );
}
