import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import "../styles/FinalizarCompra.css";

const FinalizarCompra = () => {
  const { user } = useContext(UserContext);
  const [carritoItems, setCarritoItems] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarritoItems = async () => {
      try {
        const response = await api.get("/carrito-item/");
        setCarritoItems(response.data);
      } catch (err) {
        setError(`Error al cargar el carrito: ${err.message}`);
        console.error("Error al cargar el carrito:", err);
      } finally {
        setCargando(false);
      }
    };

    if (user) {
      fetchCarritoItems();
    } else {
      setCargando(false);
      setError("Debes iniciar sesión para finalizar la compra.");
    }
  }, [user]);

  const handleConfirmarCompra = async () => {
    if (!user) {
      setError("Debes estar autenticado para finalizar la compra.");
      return;
    }
    if (!carritoItems || carritoItems.length === 0) {
      setError("El carrito está vacío. Agrega productos para comprar.");
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const response = await api.post("/venta/", {}); // Enviar POST vacío para crear la venta
      console.log("Compra finalizada:", response.data);
      alert("¡Compra finalizada con éxito!");
      navigate("/Venta"); // Redirigir a la página de detalles de la venta (podrías querer navegar a una ruta específica con el ID de la venta)
    } catch (err) {
      setError(`Error al finalizar la compra: ${err.message}`);
      console.error("Error al finalizar la compra:", err);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <p>Cargando carrito para finalizar la compra...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!carritoItems) {
    return <p>No se pudieron cargar los items del carrito.</p>;
  }

  return (
    <div className="finalizar-compra-container">
      <h1>Finalizar tu Compra</h1>
      {carritoItems.length > 0 ? (
        <div>
          <h2>Revisa tu Carrito:</h2>
          <ul>
            {carritoItems.map((item) => (
              <li key={item.id}>
                {item.producto && (
                  <>
                    {item.producto.nombre} - Cantidad: {item.cantidad} - Precio: ${item.producto.precio.toFixed(2)} - Subtotal: ${(item.cantidad * item.producto.precio).toFixed(2)}
                  </>
                )}
              </li>
            ))}
          </ul>
          <p>
            Total a pagar: $
            {carritoItems.reduce((total, item) => total + (item.producto ? item.cantidad * item.producto.precio : 0), 0).toFixed(2)}
          </p>
          <button onClick={handleConfirmarCompra}>Confirmar Compra</button>
        </div>
      ) : (
        <p>Tu carrito está vacío.</p>
      )}
      <button onClick={() => navigate("/carrito")}>Volver al Carrito</button>
    </div>
  );
};

export default FinalizarCompra;