import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Home.css';


const Home = () => {
  const { user } = useContext(UserContext);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categorias/');
        setCategorias(response.data);
      } catch (error) {
        setError('Error al cargar las categorías');
        console.error("Error en Home (Categorías):", error);
      } finally {
        setCargando(false);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="productos-categoria-container"> {/* Usamos la clase del contenedor de ProductosCategoria */}
      <h1>Nuestras Categorías</h1> {/* Modificamos el título */}

      {!user && (
        <p>
          <Link to="/login">Inicia sesión</Link> para comprar.
        </p>
      )}

      {error && <p style={{ color: 'blue' }}>{error}</p>}

      <div className="productos-grid"> {/* Usamos la clase del grid de ProductosCategoria */}
        {cargando ? (
          <p>Cargando categorías...</p>
        ) : categorias.length === 0 ? (
          <p>No hay categorías disponibles</p>
        ) : (
          categorias.map((categoria) => (
            <div key={categoria.id} className="producto-card"> {/* Usamos la clase de la tarjeta de Producto */}
              <h3>{categoria.nombre}</h3> {/* El nombre de la categoría como título */}
              {/* Enlace con el estilo de botón */}
              <div className="producto-actions"> {/* Usamos el contenedor de acciones de Producto */}
                <Link to={`/productos/categoria/${categoria.id}`} className="producto-actions button">
                  Ver Productos
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;