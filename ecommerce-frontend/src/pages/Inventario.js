import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import "../styles/Inventario.css";

const Inventario = () => {
  const { user, token } = useContext(UserContext); // ✅ Obtén el usuario y el token del contexto
  const [inventario, setInventario] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ Para la redirección

  useEffect(() => {
    const fetchInventario = async () => {
      if (token) { // ✅ Verifica si hay un token (usuario autenticado)
        try {
          const response = await axios.get("http://localhost:8000/api/inventario/", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setInventario(response.data);
        } catch (err) {
          setError("Error al cargar el inventario");
          console.error("Error fetching inventario:", err);
          // Considera manejar diferentes códigos de error (ej. 401 no autorizado)
          if (err.response && err.response.status === 401) {
            // Si no está autorizado, podrías limpiar el contexto y redirigir al login
            // setUser(null); // Asegúrate de tener setUser en tu contexto si lo necesitas
            // setToken(null); // Asegúrate de tener setToken en tu contexto si lo necesitas
            navigate('/login');
          }
        }
      } else {
        // Si no hay token, el usuario no está autenticado, redirige al login
        navigate('/login');
      }
    };

    fetchInventario();
  }, [token, navigate]); // ✅ Depende del token para refetch si cambia

  if (error) return <div>{error}</div>;

  // ✅ Si no hay usuario autenticado (token), podrías mostrar un mensaje diferente
  if (!token) {
    return (
      <div>
        <h1>Inventario</h1>
        <p>Debes iniciar sesión para ver el inventario.</p>
        {/* O podrías poner un Link al login */}
        {/* <Link to="/login">Iniciar Sesión</Link> */}
      </div>
    );
  }

  return (
    <div>
      <h1>Inventario</h1>
      {inventario.length > 0 ? (
        <ul>
          {inventario.map(item => (
            <li key={item.id}>
              <p>Producto: {item.producto_nombre}</p>
              <p>Cantidad: {item.cantidad}</p>
              <p>Última actualización: {new Date(item.ultima_actualizacion).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay datos de inventario</p>
      )}
    </div>
  );
};

export default Inventario;