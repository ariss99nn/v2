import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Productos.css";
import api from "../services/api";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true); // 👈 faltaba

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/productos/");
        setProductos(response.data);
      } catch (err) {
        setError("Error al cargar los productos");
        console.error("❌ Error productos:", err);
      } finally {
        setCargando(false); // 👈 lo agregamos acá
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="productos-container">
      <h1>Nuestros Productos</h1>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : productos.length === 0 ? (
        <p>No hay productos disponibles</p>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="producto-card">
              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>${producto.precio}</p>
              <p>{producto.descripcion}</p>
              <p>Stock: {producto.stock}</p>
              <Link to={`/productos/${producto.id}`} className="btn">
  Ver detalles
</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Productos;