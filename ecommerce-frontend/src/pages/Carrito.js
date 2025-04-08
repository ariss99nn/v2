import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/Carrito.css";
import {Link} from "react-router-dom"

const Carrito = () => {
  const { user } = useContext(UserContext);

  // Por ahora simulamos que no hay productos en el carrito
  const productosCarrito = [];

  return (
    <div className="carrito-container">
      <h1>Tu Carrito de Compras</h1>

      {!user && (
          <Link to="/login">inicia sesión</Link>
      )}

      {user && productosCarrito.length === 0 && (
        <p>No hay productos en tu carrito aún.</p>
      )}

      {user && productosCarrito.length > 0 && (
        <div className="productos-carrito">
          {productosCarrito.map((producto, index) => (
            <div key={index} className="producto-carrito">
              <h3>{producto.nombre}</h3>
              <p>Precio: ${producto.precio}</p>
              <p>Cantidad: {producto.cantidad}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carrito;