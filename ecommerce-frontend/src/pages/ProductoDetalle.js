import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { UserContext } from "../context/UserContext";

const ProductoDetalle = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);

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

  const handleComprarClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/carrito");
    } else {
      navigate("/login");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!producto) return <p>Cargando producto...</p>;

  return (
    <div className="producto-detalle">
      <h2>{producto.nombre}</h2>
      <img src={producto.imagen} alt={producto.nombre} />
      <p>Precio: ${producto.precio}</p>
      <p>Descripción: {producto.descripcion}</p>
      <p>Stock: {producto.stock}</p>

      <button type="submit" className="btn-link" onClick={handleComprarClick}>Ingresar</button>
      <br />
      <Link to="/productos">← Volver a productos</Link>
    </div>
  );
};

export default ProductoDetalle;
