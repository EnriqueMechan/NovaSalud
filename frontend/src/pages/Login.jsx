import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import logo from "../assets/logo.svg";
import illLogin from "../assets/ill-login.svg";

const FEATURES = [
  { icon: "box", text: "Inventario centralizado con stock en tiempo real" },
  { icon: "bell", text: "Alertas automáticas de reposición por producto" },
  { icon: "cart", text: "Punto de venta rápido con validación de stock" },
  { icon: "shield", text: "Acceso con sesión y permisos por rol" },
];

export default function Login() {
  const [email, setEmail] = useState("admin@novasalud.com");
  const [password, setPassword] = useState("admin123");
  const [showPass, setShowPass] = useState(false);
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
      <div className="login-split">
        <div className="login-art">
          <img src={illLogin} alt="Ilustración de la botica Nova Salud" />
          <ul className="login-feature-list">
            {FEATURES.map((f) => (
              <li key={f.icon}>
                <Icon name={f.icon} size={16} />
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="login-shell">
          <div className="login-card">
            <div className="login-hero">
              <img src={logo} alt="Nova Salud" style={{ width: 64, height: 64, borderRadius: 16 }} />
            </div>
            <div className="brand">
              <img src={logo} alt="" className="brand-mark" /> Nova Salud
            </div>
            <h2>Iniciar sesión</h2>
            <p className="subtitle">Gestión de inventario y ventas de botica</p>
            <form onSubmit={submit} style={{ width: "100%" }}>
              <div className="field" style={{ width: "100%" }}>
                <label>Correo electrónico</label>
                <div className="input-icon">
                  <Icon name="mail" size={16} />
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@novasalud.com"
                    required
                  />
                </div>
              </div>
              <div className="field" style={{ width: "100%" }}>
                <label>Contraseña</label>
                <div className="input-icon">
                  <Icon name="lock" size={16} />
                  <input
                    className="input"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                    style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)" }}
                  >
                    <Icon name="eye" size={16} />
                  </button>
                </div>
              </div>
              {error && (
                <div className="alert-box warn" role="alert">
                  <Icon name="alert" size={16} />
                  <span><strong>Error:</strong> {error}</span>
                </div>
              )}
              <div className="login-actions">
                <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>
                  <Icon name="arrowRight" size={15} />
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
      </div>
    </div>
  );
}
