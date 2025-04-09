import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importa Link
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import "../styles/Login.css";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login/", credenciales);
      const { token, ...userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      console.log("Login response", response.data)
      navigate("/");
    } catch (err) {
      console.log(err.response?.data||err.message);
      setError("Usuario o contraseña incorrectos.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credenciales.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={credenciales.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-link">Ingresar</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="registro-link">
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;