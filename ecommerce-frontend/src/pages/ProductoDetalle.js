import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { UserContext } from "../context/UserContext";

const ProductoDetalle = () => {
  const { id } = useParams();
  const { user, token } = useContext(UserContext); // ✅ Obtén el token también
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

  const handleComprarClick = async (e) => {
    e.preventDefault();
    if (user && token) { // ✅ Verifica si el usuario está autenticado y hay un token
      try {
        // ✅ Realiza una petición POST para agregar el producto al carrito
        const response = await api.post(
          "/carrito-item/", // 👈 Asegúrate de que esta sea la ruta correcta en tu backend
          {
            producto: id, // Envía el ID del producto
            cantidad: 1, // Puedes permitir al usuario seleccionar la cantidad después
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Incluye el token en la autorización
            },
          }
        );
        console.log("Producto añadido al carrito:", response.data);
        navigate("/Carrito"); // Redirige al carrito después de añadir
      } catch (error) {
        console.error("Error al añadir al carrito:", error.response?.data || error.message);
        setError("No se pudo añadir el producto al carrito.");
      }
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

      <button type="submit" className="btn-link" onClick={handleComprarClick}>
        {user ? "Añadir al Carrito" : "Ingresar para Comprar"}
      </button>
      <br />
      <Link to="/productos">← Volver a productos</Link>
    </div>
  );
};

export default ProductoDetalle;