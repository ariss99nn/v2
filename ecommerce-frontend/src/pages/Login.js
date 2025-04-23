import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import "../styles/Login.css";

const Login = () => {
  const { setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({ username: "", password: "" }); // Usamos 'username' aquí
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const crearCarritoUsuario = async (token) => {
    try {
      const response = await api.post("/carrito/", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("carrito creado para el usuario");
    } catch (error) {
      console.error("Error al crear el carrito:", error.response?.data || error.message);
      setError("Error al iniciar sesión (no se pudo crear el carrito).");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login/", credenciales);
      const { access, refresh, user } = response.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setToken(access);

      console.log("Login correcto:", response.data);
      await crearCarritoUsuario(access);

      navigate("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username" // Corregido a "username"
          placeholder="Username o Email"
          value={credenciales.username} // Actualizado a credenciales.username
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