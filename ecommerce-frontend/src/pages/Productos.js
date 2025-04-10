import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Productos.css";
import api from "../services/api";
import { UserContext } from "../context/UserContext";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/productos/");
        setProductos(response.data);
      } catch (err) {
        setError("Error al cargar los productos");
        console.error("Error productos:", err);
      } finally {
        setCargando(false);
      }
    };

    fetchProductos();
  }, []);

  const agregarAlCarrito = async (productoId) => {
    if (!token) {
      alert("Debes iniciar sesión para agregar productos");
      navigate("/login");
      return;
    }

    try {
      await api.post("/carrito-item/", {
        producto: productoId,
        cantidad: 1,
      });

      alert("Producto agregado al carrito 🎉");
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      alert("Ocurrió un error al agregar el producto");
    }
  };

  return (
    <div className="productos-container">
      <h1>Nuestros Productos</h1>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : productos.length === 0 ? (
        <p>No hay productos disponibles</p>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="producto-card">
              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>${producto.precio}</p>
              <p>{producto.descripcion}</p>
              <p>Stock: {producto.stock}</p>

              {token ? (
                <button
                  className="btn comprar"
                  onClick={() => agregarAlCarrito(producto.id)}
                >
                  Comprar
                </button>
              ) : (
                <Link to={`/productos/${producto.id}`} className="btn">
                  Ver detalles
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Productos;