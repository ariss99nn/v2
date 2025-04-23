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

  const handleCantidadChange = (event, itemId) => {
    const newCantidad = parseInt(event.target.value, 10);
    if (!isNaN(newCantidad) && newCantidad > 0) {
      const updatedProductos = productos.map(producto =>
        producto.id === itemId ? { ...producto, cantidad: newCantidad } : producto
      );
      setProductos(updatedProductos);
    }
  };

  const handleUpdateCantidad = async (itemId, nuevaCantidad) => {
    try {
      await api.patch(`/carrito-item/${itemId}/`, { cantidad: nuevaCantidad });
      // Opcional: Mostrar un mensaje de éxito al usuario
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      setError("Error al actualizar la cantidad del producto");
      // Opcional: Revertir la cantidad en el estado local si la actualización falla
      const originalProducto = productos.find(p => p.id === itemId);
      if (originalProducto) {
        const updatedProductos = productos.map(p =>
          p.id === itemId ? { ...p, cantidad: originalProducto.cantidad } : p
        );
        setProductos(updatedProductos);
      }
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
              <div className="cantidad-selector">
                <label htmlFor={`cantidad-${producto.id}`}>Cantidad:</label>
                <input
                  type="number"
                  id={`cantidad-${producto.id}`}
                  value={producto.cantidad}
                  min="1"
                  onChange={(event) => handleCantidadChange(event, producto.id)}
                  onBlur={() => handleUpdateCantidad(producto.id, producto.cantidad)}
                />
              </div>
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