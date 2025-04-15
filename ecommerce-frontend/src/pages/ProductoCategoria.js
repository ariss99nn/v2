import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../styles/ProductosCategoria.css'; // Asegúrate de tener un archivo CSS para esta página

const ProductosCategoria = () => {
  const { categoriaId } = useParams(); // Obtiene el ID de la categoría desde la URL (si está configurado así)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoriaNombreQuery = queryParams.get('categoria'); // Obtiene el nombre de la categoría desde la query param
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
        } else if (categoriaNombreQuery) {
          url += `?nombre_categoria=${categoriaNombreQuery}`; // Filtrar por nombre si está en la query
          // Nota: Ajusta 'nombre_categoria' al nombre del campo de filtro en tu backend
        }

        const response = await api.get(url);
        setProductos(response.data);

        // Si no tenemos el nombre de la categoría y estamos filtrando por ID,
        // podríamos hacer una llamada adicional para obtener el nombre de la categoría
        if (categoriaId && !categoriaNombreQuery && response.data.length > 0) {
          // Asumiendo que el primer producto tiene la información de la categoría
          setCategoriaNombre(response.data[0].categoria_nombre || ''); // Ajusta según la estructura de tu respuesta
        }

      } catch (error) {
        setError('Error al cargar los productos de esta categoría');
        console.error("Error en ProductosCategoria:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchProductosPorCategoria();
  }, [categoriaId, categoriaNombreQuery]);

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