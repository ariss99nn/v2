import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/Carrito.css";
import api from "../services/api";
import { Link } from "react-router-dom";

const Carrito = () => {
  const { user } = useContext(UserContext);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const response = await api.get("/carrito-item/"); // Asegúrate de la URL correcta
        setProductos(response.data);
      } catch (error) {
        setError("Error al cargar los productos del carrito");
        console.error("Error carrito:", error);
      } finally {
        setCargando(false);
      }
    };

    if (user) { // Solo fetch si el usuario está autenticado
      fetchCarrito();
    } else {
      setCargando(false);
      setProductos([]); // Limpiar el carrito si no hay usuario
    }
  }, [user]); // ✅ Lista de dependencias: solo se ejecuta cuando cambia 'user'

  return (
    <div className="carrito-container">
      <h1>Tu Carrito de Compras</h1>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : !user ? (
        <p>
          <Link to="/login">Inicia sesión para ver tu carrito</Link>
        </p>
      ) : productos.length === 0 ? (
        <p>No hay productos en tu carrito aún.</p>
      ) : (
        <div className="productos-carrito">
          {productos.map((producto, index) => (
            <div key={index} className="producto-carrito">
              {producto.producto && ( // ✅ Asegúrate de que 'producto' y 'producto.nombre' existan
                <>
                  <p>{producto.producto.nombre}</p>
                  <p>Precio: ${producto.producto.precio}</p>
                </>
              )}
              <p>Cantidad: {producto.cantidad}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carrito;