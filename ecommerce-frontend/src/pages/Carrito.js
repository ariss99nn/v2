import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/Carrito.css";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Carrito = () => {
  const { user } = useContext(UserContext);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const response = await api.get("/carrito-item/");
        setProductos(response.data);
      } catch (error) {
        setError("Error al cargar los productos del carrito");
        console.error("Error carrito:", error);
      } finally {
        setCargando(false);
      }
    };

    if (user) {
      fetchCarrito();
    } else {
      setCargando(false);
      setProductos([]);
    }
  }, [user]);

  const handleRemoveProducto = async (itemId) => {
    try {
      await api.delete(`/carrito-item/${itemId}/`);
      const updatedProductos = productos.filter(producto => producto.id !== itemId);
      setProductos(updatedProductos);
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      setError("Error al eliminar el producto del carrito");
    }
  };

  const handleFinalizarCompra = () => {
    navigate("/FinalizarCompra"); // Redirigir a un nuevo componente para finalizar la compra
  };

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
          {productos.map((producto) => (
            <div key={producto.id} className="producto-carrito">
              {producto.producto && (
                <>
                  <p>{producto.producto.nombre}</p>
                  <p>Precio: ${producto.producto.precio}</p>
                  {producto.producto.categoria && (
                    <p>Categoría: {producto.producto.categoria.nombre}</p>
                  )}
                </>
              )}
              <p>Cantidad: {producto.cantidad}</p>
              <button onClick={() => handleRemoveProducto(producto.id)}>
                Remover
              </button>
            </div>
          ))}
          <button className="comprar-button" onClick={handleFinalizarCompra}>
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
};

export default Carrito;