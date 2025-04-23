import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import { registrarUsuario } from "../services/api";
import "../styles/Registro.css";

const Registro = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      //const data = 
      await registrarUsuario(formData);
      setMensaje("✅ Usuario registrado con éxito. Puedes iniciar sesión.");
      setFormData({ username: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err.response?.data||err.message);
      setError(err.message || "Error al registrar");
    }
  };

  return (
    <div className="login-container">
      <h2>Registro De Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Usuario" type="text" value={formData.username} onChange={handleChange} required />
        <input name="email" placeholder="Correo electrónico" type="email" value={formData.email} onChange={handleChange} required />
        <input name="password" placeholder="Contraseña" type="password" value={formData.password} onChange={handleChange} required />
        <button className="btn" onClick={handleSubmit}>Registrarme</button>
      </form>
      {mensaje && <p className="mensaje-ok">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}
    </div>
  );
};

export default Registro;