import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/api";
import "../styles/Registro.css";
import { UserContext } from "../context/UserContext";

const Registro = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    cedula: "",
    rol: "CLIENT",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const esAdministrador = user?.rol === "ADMIN";
  const [erroresBackend, setErroresBackend] = useState({}); // Estado para errores específicos del backend

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar el error asociado al campo al cambiar su valor
    if (erroresBackend[e.target.name]) {
      setErroresBackend({ ...erroresBackend, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setErroresBackend({}); // Limpiar errores del backend al intentar registrar

    try {
      await registrarUsuario(formData);
      setMensaje("✅ Usuario registrado con éxito. Puedes iniciar sesión.");
      setFormData({
        username: "",
        email: "",
        password: "",
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        cedula: "",
        rol: "CLIENT",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.message || "Error al registrar");
      // Si la API devuelve un error con detalles sobre los campos duplicados
      if (err.response?.data?.errors) {
        setErroresBackend(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message); // Mostrar un mensaje de error general del backend
      }
    }
  };

  return (
    <div className="login-container registro-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Usuario" type="text" value={formData.username} onChange={handleChange} required />
        {erroresBackend.username && <p className="mensaje-error">{erroresBackend.username}</p>}

        <input name="email" placeholder="Correo electrónico" type="email" value={formData.email} onChange={handleChange} required />
        {erroresBackend.email && <p className="mensaje-error">{erroresBackend.email}</p>}

        <input name="password" placeholder="Contraseña" type="password" value={formData.password} onChange={handleChange} required />
        <input name="nombre" placeholder="Nombre" type="text" value={formData.nombre} onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" type="text" value={formData.apellido} onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" type="text" value={formData.direccion} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" type="text" value={formData.telefono} onChange={handleChange} required />
        <input name="cedula" placeholder="Cédula" type="text" value={formData.cedula} onChange={handleChange} required />
        {erroresBackend.cedula && <p className="mensaje-error">{erroresBackend.cedula}</p>}

        {esAdministrador && (
          <select name="rol" value={formData.rol} onChange={handleChange}>
            <option value="CLIENT">Cliente</option>
            <option value="EMPLOYEE">Empleado</option>
            <option value="ADMIN">Administrador</option>
          </select>
        )}

        <button className="btn" type="submit">Registrarme</button>
      </form>
      {mensaje && <p className="mensaje-ok">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}
    </div>
  );
};

export default Registro;