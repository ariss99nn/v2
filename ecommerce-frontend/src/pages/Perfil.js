import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import "../styles/Perfil.css"; // O crea un archivo CSS para este componente

const Perfil = () => {
  const { user: loggedInUser, token } = useContext(UserContext);
  const [usuarioPerfil, setUsuarioPerfil] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [usuariosAdmin, setUsuariosAdmin] = useState([]); // Para que el admin elija usuario
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState(null);
  const navigate = useNavigate();
  const { id: userIdFromParams } = useParams(); // ID del usuario a editar (si es admin)

  const esAdmin = loggedInUser?.rol === "ADMIN";
  const usuarioIdParaEditar = esAdmin && userIdFromParams ? userIdFromParams : loggedInUser?.id;

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login"); // Redirigir si no hay usuario logueado
      return;
    }

    const cargarPerfil = async (id) => {
      try {
        const response = await api.get(`/usuarios/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarioPerfil(response.data);
        setFormData(response.data); // Inicializar el formulario con los datos del usuario
      } catch (error) {
        console.error("Error al cargar el perfil:", error.response?.data || error.message);
        setError("Error al cargar el perfil.");
      }
    };

    if (usuarioIdParaEditar) {
      cargarPerfil(usuarioIdParaEditar);
    }

    // Si es admin, cargar la lista de todos los usuarios
    if (esAdmin) {
      const cargarUsuariosAdmin = async () => {
        try {
          const response = await api.get("/usuarios/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsuariosAdmin(response.data);
          // Si no hay un usuario seleccionado por parámetro, seleccionar el primero
          if (!userIdFromParams && response.data.length > 0) {
            setUsuarioSeleccionadoId(response.data[0].id);
            cargarPerfil(response.data[0].id);
          } else if (userIdFromParams) {
            setUsuarioSeleccionadoId(userIdFromParams);
          }
        } catch (error) {
          console.error("Error al cargar la lista de usuarios para el admin:", error.response?.data || error.message);
          setError("Error al cargar la lista de usuarios.");
        }
      };
      cargarUsuariosAdmin();
    }
  }, [loggedInUser, token, navigate, userIdFromParams, esAdmin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const response = await api.put(`/usuarios/${usuarioIdParaEditar}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("✅ Perfil actualizado con éxito.");
      setUsuarioPerfil(response.data); // Actualizar el estado del perfil con los nuevos datos
    } catch (error) {
      console.error("Error al guardar los cambios:", error.response?.data || error.message);
      setError("Error al guardar los cambios.");
    }
  };

  const handleSeleccionarUsuarioAdmin = (e) => {
    const selectedId = e.target.value;
    setUsuarioSeleccionadoId(selectedId);
    navigate(`/perfil/${selectedId}`); // Navegar para actualizar los parámetros y recargar el perfil
  };

  if (!usuarioPerfil || !formData) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="perfil-container">
      <h2>Perfil de Usuario</h2>

      {esAdmin && usuariosAdmin.length > 0 && (
        <div className="admin-select-user">
          <label htmlFor="usuario-admin">Seleccionar Usuario:</label>
          <select id="usuario-admin" value={usuarioSeleccionadoId} onChange={handleSeleccionarUsuarioAdmin}>
            {usuariosAdmin.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.nombre} {user.apellido})
              </option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={handleGuardarCambios}>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} readOnly={!esAdmin} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} readOnly={!esAdmin} />
        </div>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección:</label>
          <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="cedula">Cédula:</label>
          <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} required readOnly={!esAdmin} />
        </div>
        <div className="form-group">
          <label htmlFor="rol">Rol:</label>
          <input type="text" id="rol" name="rol" value={formData.rol} readOnly />
        </div>

        <button type="submit" className="btn">Guardar Cambios</button>
        {mensaje && <p className="mensaje-ok">{mensaje}</p>}
        {error && <p className="mensaje-error">{error}</p>}
      </form>
    </div>
  );
};

export default Perfil;