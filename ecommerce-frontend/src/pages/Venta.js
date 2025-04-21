import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api";
import "../styles/Venta.css";

const Venta = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [venta, setVenta] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [carritoItems, setCarritoItems] = useState([]);

  useEffect(() => {
    const fetchCarritoItems = async () => {
      if (user) {
        try {
          const response = await api.get("/carrito-item/");
          setCarritoItems(response.data);
          setCargando(false);
        } catch (error) {
          console.error("Error al cargar los items del carrito:", error);
          setError("Error al cargar los items del carrito.");
          setCargando(false);
        }
      } else {
        setCargando(false);
        setError("Debes estar autenticado para ver el carrito.");
      }
    };

    fetchCarritoItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleFinalizarCompra = async () => {
    if (!user) {
      setError("Debes estar autenticado para finalizar la compra.");
      return;
    }
    if (carritoItems.length === 0) {
      setError("El carrito está vacío. Agrega productos para finalizar la compra.");
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const response = await api.post("/venta/", {}); // Enviar una solicitud POST vacía para crear la venta
      setVenta(response.data); // La respuesta contendrá los detalles de la venta creada
      setCarritoItems([]); // Limpiar el carrito en el frontend
      navigate("/venta"); // Redirigir a la página de detalles de la venta
      alert("¡Compra finalizada con éxito!");
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      setError("Error al finalizar la compra.");
    } finally {
      setCargando(false);
    }
  };

  const handleCalificacionChange = (event) => {
    setCalificacion(parseInt(event.target.value, 10));
  };

  const handleComentarioChange = (event) => {
    setComentario(event.target.value);
  };

  const handleSubmitCalificacion = async () => {
    if (!user) {
      setError("Debes estar autenticado para calificar.");
      return;
    }
    if (!venta || !venta.id) {
      setError("No se puede calificar la venta.");
      return;
    }

    try {
      const response = await api.post("/calificaciones/", {
        venta: venta.id,
        calificacion: calificacion,
        comentario: comentario,
      });
      console.log("Calificación enviada:", response.data);
      alert("¡Gracias por tu calificación!");
      setCalificacion(5);
      setComentario("");
      // Opcional: podrías recargar los detalles de la venta
    } catch (error) {
      console.error("Error al enviar la calificación:", error);
      setError("Error al enviar la calificación.");
    }
  };

  if (cargando) {
    return <p>Cargando carrito y preparando la compra...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="venta-container">
      <h1>Finalizar Compra</h1>

      {carritoItems.length > 0 ? (
        <div className="productos-comprados">
          <h2>Productos en tu Carrito:</h2>
          <ul>
            {carritoItems.map((item, index) => (
              <li key={index}>
                {item.producto.nombre} - Cantidad: {item.cantidad} - Precio Unitario: ${item.producto.precio.toFixed(2)} - Subtotal: ${(item.cantidad * item.producto.precio).toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="total-venta">
            Total a Pagar: $
            {carritoItems.reduce((total, item) => total + item.cantidad * item.producto.precio, 0).toFixed(2)}
          </p>
          <button onClick={handleFinalizarCompra} className="finalizar-compra-button">
            Finalizar Compra
          </button>
        </div>
      ) : (
        <p>Tu carrito está vacío. ¡Agrega productos para comprar!</p>
      )}

      {venta && (
        <div className="detalles-venta-finalizada">
          <h2>Detalles de la Venta Finalizada #{venta.id}</h2>
          {venta.detalles && venta.detalles.length > 0 ? (
            <ul>
              {venta.detalles.map((item, index) => (
                <li key={index}>
                  {item.producto} - Cantidad: {item.cantidad} - Precio Unitario: ${item.precio_unitario.toFixed(2)} - Subtotal: ${(item.cantidad * item.precio_unitario).toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay detalles de productos para esta venta.</p>
          )}
          <p className="total-venta">Total de la Venta: ${venta.total.toFixed(2)}</p>

          {!venta.calificacion && (
            <div className="calificacion-servicio">
              <h2>Calificar Servicio:</h2>
              <div>
                <label htmlFor="calificacion">Calificación (1-5): </label>
                <select
                  id="calificacion"
                  value={calificacion}
                  onChange={handleCalificacionChange}
                >
                  <option value={1}>1 - Muy Malo</option>
                  <option value={2}>2 - Malo</option>
                  <option value={3}>3 - Regular</option>
                  <option value={4}>4 - Bueno</option>
                  <option value={5}>5 - Excelente</option>
                </select>
              </div>
              <div>
                <label htmlFor="comentario">Comentario (opcional):</label>
                <textarea
                  id="comentario"
                  value={comentario}
                  onChange={handleComentarioChange}
                  rows="3"
                ></textarea>
              </div>
              <button onClick={handleSubmitCalificacion}>Enviar Calificación</button>
            </div>
          )}

          {venta.calificacion && (
            <div className="calificacion-existente">
              <h2>Tu Calificación:</h2>
              <p>Calificación: {venta.calificacion.calificacion} / 5</p>
              {venta.calificacion.comentario && <p>Comentario: {venta.calificacion.comentario}</p>}
            </div>
          )}
        </div>
      )}

      <button onClick={() => navigate("/carrito")}>Volver al Carrito</button>
      <button onClick={() => navigate("/")}>Volver a la Tienda</button>
    </div>
  );
};

export default Venta;