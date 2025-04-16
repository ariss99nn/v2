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

  useEffect(() => {
    const fetchUltimaVenta = async () => {
      if (user) {
        try {
          // Obtener la última venta del usuario (asumiendo que están ordenadas por fecha descendente)
          const ventasResponse = await api.get(`/venta/?usuario=${user.id}&ordering=-fecha`);
          if (ventasResponse.data && ventasResponse.data.length > 0) {
            setVenta(ventasResponse.data[0]);
          } else {
            setError("No se encontraron ventas para este usuario.");
          }
        } catch (error) {
          console.error("Error al cargar la última venta:", error);
          setError("Error al cargar la información de la venta.");
        } finally {
          setCargando(false);
        }
      } else {
        setCargando(false);
        setError("Debes estar autenticado para ver tus ventas.");
      }
    };

    fetchUltimaVenta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
    return <p>Cargando detalles de la venta...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!venta) {
    return <p>No hay detalles de venta disponibles.</p>;
  }

  const items = venta.detalles || []; // Accede a los detalles de la venta

  return (
    <div className="venta-container">
      <h1>Detalles de tu Venta #{venta.id}</h1>

      {items.length > 0 ? (
        <div className="productos-comprados">
          <h2>Productos Comprados:</h2>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.producto} - Cantidad: {item.cantidad} - Precio Unitario: ${item.precio_unitario.toFixed(2)} - Subtotal: ${(item.cantidad * item.precio_unitario).toFixed(2)}
              </li>
            ))}
          </ul>
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
      ) : (
        <p>No hay productos en esta venta.</p>
      )}

      <button onClick={() => navigate("/carrito")}>Volver al Carrito</button>
      <button onClick={() => navigate("/")}>Volver a la Tienda</button>
    </div>
  );
};

export default Venta;