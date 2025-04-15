import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import "../styles/Login.css";

const Login = () => {
  const { setUser, setToken } = useContext(UserContext); // ✅ añadimos setToken
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const crearCarritoUsuario = async (token) => {
    try {
      // Asegúrate de que tu API backend tenga un endpoint para crear un carrito
      // asociado a un usuario autenticado. La ruta podría ser diferente.
      const response = await api.post("/carrito/", {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Si tu backend usa JWT
        },
      });
      console.log("Carrito creado para el usuario:", response.data);
      // No necesitamos hacer nada más con la respuesta aquí, el carrito ya está creado en el backend
    } catch (error) {
      console.error("Error al crear el carrito:", error.response?.data || error.message);
      // Podrías mostrar un mensaje de error al usuario si la creación del carrito falla
      setError("Error al iniciar sesión (no se pudo crear el carrito).");
      // Considera si quieres desloguear al usuario en este caso, ya que no tiene carrito.
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
      const { access, refresh, user } = response.data; // ✅ obtenemos lo que el backend devuelve

      // Guardar tokens y usuario en localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      // Guardar en contexto
      setUser(user);
      setToken(access);

      console.log("Login correcto:", response.data);
      // Crear el carrito del usuario después de iniciar sesión
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