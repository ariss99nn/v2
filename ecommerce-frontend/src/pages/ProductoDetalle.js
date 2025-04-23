import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { UserContext } from "../context/UserContext";
import "../styles/ProductoDetalle.css"; // Importa el archivo CSS

const ProductoDetalle = () => {
  const { id } = useParams();
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para la carga

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true); // Indica que la carga ha comenzado
      setError(null); // Limpia cualquier error previo
      try {
        const response = await api.get(`/productos/${id}/`);
        setProducto(response.data);
      } catch (err) {
        setError("No se pudo cargar el producto.");
        console.error("❌ Error:", err);
      } finally {
        setLoading(false); // Indica que la carga ha terminado, exitosa o no
      }
    };
    fetchProducto();
  }, [id]);

  const handleCantidadChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setCantidad(isNaN(value) || value < 1 ? 1 : value);
  };

  const handleComprarClick = async (e) => {
    e.preventDefault();
    if (user && token) {
      try {
        const response = await api.post(
          "/carrito-item/",
          {
            producto: id,
            cantidad: cantidad,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Producto añadido al carrito:", response.data);
        setMensaje("Producto añadido al carrito 🎉");
        setTimeout(() => setMensaje(null), 3000);
        setError(null); // Limpia cualquier error previo de añadir al carrito
      } catch (error) {
        console.error("Error al añadir al carrito:", error.response?.data || error.message);
        setError("No se pudo añadir el producto al carrito.");
        setMensaje(null); // Limpia cualquier mensaje de éxito previo
      }
    } else {
      navigate("/login");
    }
  };

  if (loading) return <p>Cargando producto...</p>; // Muestra un mensaje de carga
  if (error) return <p className="error-message">{error}</p>;
  if (!producto) return <p>No se encontró el producto.</p>; // Mejor mensaje si no se encuentra el producto

  return (
    <div className="producto-detalle-container">
      <h2>{producto.nombre}</h2>
      {producto.imagen && ( // Asegúrate de que la imagen exista antes de renderizarla
        <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
      )}
      <p className="producto-precio">Precio: ${producto.precio}</p>
      <p className="producto-descripcion">{producto.descripcion}</p>
      <p className="producto-stock">Stock: {producto.stock}</p>

      <div className="compra-section">
        <div className="cantidad-selector">
          <label htmlFor="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            min="1"
            onChange={handleCantidadChange}
          />
        </div>
        <button className="comprar-btn" onClick={handleComprarClick} disabled={producto.stock < 1 && user}>
          {user ? producto.stock < 1 ? "Sin Stock" : "Añadir al Carrito" : "Ingresar para Comprar"}
        </button>
      </div>

      {mensaje && <p className="success-message">{mensaje}</p>}

      <Link to="/productos" className="volver-link">
        ← Volver a productos
      </Link>
    </div>
  );
};

export default ProductoDetalle;