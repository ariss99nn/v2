import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Home.css'; // Asegúrate de tener un archivo CSS para estilos
import '../styles/ProductosCategoria.css';
const Home = () => {
  const { user } = useContext(UserContext);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categorias/'); // 👈 Cambia la ruta a tu endpoint de categorías
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
    <div className="home-container">
      <h1>Bienvenido a la Tienda</h1>

      {!user && (
        <p>
          <Link to="/login">Inicia sesión</Link> para comprar.
        </p>
      )}

      {error && <p style={{ color: 'blue' }}>{error}</p>}

      <div className="categorias-container">
        <h2>Nuestras Categorías</h2>

        {cargando ? (
          <p>Cargando categorías...</p>
        ) : categorias.length === 0 ? (
          <p>No hay categorías disponibles</p>
        ) : (
          <div className="categorias-grid">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="categoria-card">
                <h3>{categoria.nombre}</h3>
                {/* Puedes añadir más información de la categoría aquí si lo deseas */}
                <Link to={`/productos?categoria=${categoria.id}`}>Ver Productos</Link> {/* Enlace para ver productos por categoría */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;