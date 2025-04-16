import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles/ProductosCategoria.css'; // Asegúrate de tener un archivo CSS para esta página

const ProductosCategoria = () => {
  const { categoriaId } = useParams(); // Obtiene el ID de la categoría desde la URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoriaNombreQuery = queryParams.get('categoriaNombre'); // Obtiene el nombre de la categoría desde la query param

  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [categoriaNombre, setCategoriaNombre] = useState(categoriaNombreQuery || '');

  useEffect(() => {
    const fetchProductosPorCategoria = async () => {
      setCargando(true);
      try {
        let url = '/productos/'; // Endpoint base para productos
        if (categoriaId) {
          url += `?categoria=${categoriaId}`; // Filtrar por ID si está en la URL
        }
        // Ya no necesitamos la lógica para filtrar por nombre desde la query param
        // ya que el ID es más directo y eficiente.

        const response = await api.get(url);
        setProductos(response.data);

        // Si no tenemos el nombre de la categoría y estamos filtrando por ID,
        // intentamos obtenerlo del primer producto de la respuesta.
        if (categoriaId && !categoriaNombreQuery && response.data.length > 0 && response.data[0].categoria) {
          setCategoriaNombre(response.data[0].categoria.nombre || '');
        } else if (categoriaNombreQuery) {
          setCategoriaNombre(categoriaNombreQuery); // Usamos el nombre de la query param si está disponible
        }

      } catch (error) {
        setError('Error al cargar los productos de esta categoría');
        console.error("Error en ProductosCategoria:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchProductosPorCategoria();
  }, [categoriaId]); // Depende solo del ID de la categoría

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
              <img src={producto.imagen} alt={producto.nombre} />
              <h3>{producto.nombre}</h3>
              <p>Precio: ${producto.precio}</p>
              <p>{producto.descripcion}</p>
              <p>Stock: {producto.stock}</p>
              {/* Puedes añadir un botón para ver detalles o añadir al carrito aquí */}
              {/* <Link to={`/productos/${producto.id}`}>Ver Detalle</Link> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosCategoria;