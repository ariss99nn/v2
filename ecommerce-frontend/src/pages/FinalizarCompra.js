import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import "../styles/FinalizarCompra.css"; // Importa estilos si los tienes

const FinalizarCompra = () => {
  const { token } = useContext(UserContext);
  const [venta, setVenta] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleConfirmarCompra = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await api.post(
        "/venta/", // La URL para finalizar la compra (crear la venta)
        {}, // El cuerpo de la petición está vacío según tu indicación
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token de autenticación
          },
        }
      );
      setVenta(response.data); // Guarda la información de la venta
    } catch (error) {
      console.error("Error al finalizar la compra:", error.response?.data || error.message);
      setError("Hubo un error al finalizar la compra.");
    } finally {
      setCargando(false);
    }
  };

  const handleVolverAlCarrito = () => {
    navigate("/carrito");
  };

  return (
    <div className="finalizar-compra-container">
      <h1>Finalizar Compra</h1>

      {cargando ? (
        <p>Finalizando compra...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : venta ? (
        <div className="venta-detalles">
          <h2>Compra Exitosa 🎉</h2>
          <p>ID de Venta: {venta.id}</p>
          <p>Fecha: {new Date(venta.fecha).toLocaleString()}</p>
          <p>Total: ${venta.total}</p>

          <h3>Detalles de la Compra:</h3>
          {venta.detalles && venta.detalles.length > 0 ? (
            <ul className="detalles-lista">
              {venta.detalles.map((detalle) => (
                <li key={detalle.id} className="detalle-item">
                  {detalle.producto && <p>Producto ID: {detalle.producto}</p>}
                  <p>Cantidad: {detalle.cantidad}</p>
                  <p>Precio Unitario: ${detalle.precio_unitario}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay detalles de productos en esta venta.</p>
          )}

          <button onClick={() => navigate("/productos")}>Volver a Productos</button>
        </div>
      ) : (
        <div className="confirmar-compra">
          <p>¿Estás seguro de que deseas finalizar la compra?</p>
          <button className="confirmar-button" onClick={handleConfirmarCompra} disabled={cargando}>
            {cargando ? "Finalizando..." : "Confirmar Compra"}
          </button>
          <button className="volver-button" onClick={handleVolverAlCarrito}>
            Volver al Carrito
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalizarCompra;