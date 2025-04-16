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

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await api.get(`/productos/${id}/`);
        setProducto(response.data);
      } catch (err) {
        setError("No se pudo cargar el producto.");
        console.error("❌ Error:", err);
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
      } catch (error) {
        console.error("Error al añadir al carrito:", error.response?.data || error.message);
        setError("No se pudo añadir el producto al carrito.");
      }
    } else {
      navigate("/login");
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!producto) return <p>Cargando producto...</p>;

  return (
    <div className="producto-detalle-container">
      <h2>{producto.nombre}</h2>
      <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
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
        <button className="comprar-btn" onClick={handleComprarClick}>
          {user ? "Añadir al Carrito" : "Ingresar para Comprar"}
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