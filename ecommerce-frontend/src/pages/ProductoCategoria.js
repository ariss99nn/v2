import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/ProductosCategoria.css';
import { UserContext } from '../context/UserContext'; // Importa el UserContext

const ProductosCategoria = () => {
  const { categoriaId } = useParams();
  const { user } = useContext(UserContext); // Obtén el estado del usuario del contexto
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [categoriaNombre, setCategoriaNombre] = useState('');

  useEffect(() => {
    const fetchProductosPorCategoria = async () => {
      setCargando(true);
      try {
        let url = '/productos/';
        if (categoriaId) {
          url += `?categoria=${categoriaId}`;
        }

        const response = await api.get(url);
        setProductos(response.data);

        if (categoriaId && response.data.length > 0 && response.data[0].categoria) {
          setCategoriaNombre(response.data[0].categoria.nombre || '');
        }

      } catch (error) {
        setError('Error al cargar los productos de esta categoría');
        console.error("Error en ProductosCategoria:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchProductosPorCategoria();
  }, [categoriaId]);

  const handleVerDetalles = (productoId) => {
    navigate(`/productos/${productoId}`);
  };

  const handleComprar = async (productoId) => {
    if (!user) {
      // Esto no debería pasar si el botón de comprar solo se muestra a usuarios logueados
      console.error("Usuario no autenticado intentando comprar.");
      return;
    }
    try {
      // Aquí implementarías la lógica para agregar el producto al carrito
      // Esto podría ser una petición POST a un endpoint de tu API
      const response = await api.post('/carrito-item/', { producto: productoId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`, // Asume que el token está en localStorage
        },
      });
      console.log("Producto agregado al carrito:", response.data);
      alert("Producto agregado al carrito 🎉");
      // Puedes mostrar un mensaje de éxito al usuario aquí
    } catch (error) {
      console.error("Error al agregar al carrito:", error.response?.data || error.message);
      setError('Error al agregar el producto al carrito.');
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  };

  return (
    <div className="productos-categoria-container">
      <h1>Productos de la Categoría: {categoriaNombre}</h1>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : productos.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="producto-card">
              {producto.imagen && <img src={producto.imagen} alt={producto.nombre} />}
              <h3>{producto.nombre}</h3>
              <p>Precio: ${producto.precio}</p>
              <p>{producto.descripcion}</p>
              <p>Stock: {producto.stock}</p>
              <div className="producto-actions">
                <button onClick={() => handleVerDetalles(producto.id)}>Ver Detalles</button>
                {user && (
                  <button onClick={() => handleComprar(producto.id)}>Comprar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosCategoria;