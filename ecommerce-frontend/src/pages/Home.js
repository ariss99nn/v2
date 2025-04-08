import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const { user } = useContext(UserContext);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Consulta pública de productos (sin token)
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get('/productos/');
        setProductos(response.data);
      } catch (error) {
        setError('Error al cargar los productos');
        console.error("Error en Home:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, []);

  return (
    <div className="home-container">
      <h1>Bienvenido a la Tienda</h1>

      {!user && (
        <p>
          <Link to="/login">Inicia sesión</Link> para comprar.
        </p>
      )}

      {error && <p style={{ color: 'blue' }}>{error}</p>}

      <div className="productos-container">
        <h2>Nuestros Productos</h2>

        {cargando ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          <div className="productos-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="producto-card">
                <img src={producto.imagen} alt={producto.nombre} />
                <h3>{producto.nombre}</h3>
                <p>Precio: ${producto.precio}</p>
                <p>{producto.descripcion}</p>
                <p>Stock: {producto.stock}</p>
                <Link to={`/productos/${producto.id}`}>Ver Detalle</Link>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;