import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/inventario/inventario/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInventario(response.data);
      } catch (err) {
        setError("Error al cargar el inventario");
      }
    };

    fetchInventario();
  }, []);

  if (error) return <div>{error}</div>;

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
