import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Asegúrate de que tu instancia de axios esté aquí
import '../styles/Reportes.css'; // Si deseas añadir estilos específicos

const Reportes = () => {
  const [reporteVentas, setReporteVentas] = useState(null);
  const [reporteVentasUsuario, setReporteVentasUsuario] = useState(null);
  const [reporteProductosVendidos, setReporteProductosVendidos] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('access'); // Obtén el token de autenticación

  useEffect(() => {
    const fetchReportes = async () => {
      setError('');
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const ventasResponse = await api.get('/reportes/ventas/', { headers }); // ✅ Coincide con ventas/urls.py
        setReporteVentas(ventasResponse.data);

        const ventasUsuarioResponse = await api.get('/reportes/ventas-usuario/', { headers }); // ✅ Coincide con ventas/urls.py
        setReporteVentasUsuario(ventasUsuarioResponse.data);

        const productosVendidosResponse = await api.get('/reportes/productos-mas-vendidos/', { headers }); // ✅ Coincide con ventas/urls.py
        setReporteProductosVendidos(productosVendidosResponse.data);

      } catch (error) {
        console.error('Error al cargar los reportes:', error.response?.data || error.message);
        setError('Error al cargar los reportes.');
      }
    };

    fetchReportes();
  }, [token]);

  if (error) {
    return <div className="reportes-container"><p className="error-message">{error}</p></div>;
  }

  if (!reporteVentas || !reporteVentasUsuario || !reporteProductosVendidos) {
    return <div className="reportes-container"><p>Cargando reportes...</p></div>;
  }

  return (
    <div className="reportes-container">
      <h2>Reporte General de Ventas</h2>
      {reporteVentas && (
        <div className="reporte-item">
          <p><strong>Total de Ventas:</strong> {reporteVentas.total_ventas}</p>
          <p><strong>Ingresos Totales:</strong> ${reporteVentas.ingresos_totales}</p>
        </div>
      )}

      <h2>Reporte de Ventas por Usuario</h2>
      {reporteVentasUsuario && reporteVentasUsuario.length > 0 ? (
        <ul className="reporte-lista">
          {reporteVentasUsuario.map((item, index) => (
            <li key={index}>
              <strong>Usuario:</strong> {item.usuario__username}
              <ul>
                <li><strong>Total Ventas:</strong> ${item.total_ventas}</li>
                <li><strong>Cantidad de Ventas:</strong> {item.cantidad_ventas}</li>
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay ventas registradas por usuario.</p>
      )}

      <h2>Reporte de Productos Más Vendidos</h2>
      {reporteProductosVendidos && reporteProductosVendidos.length > 0 ? (
        <ul className="reporte-lista">
          {reporteProductosVendidos.map((item, index) => (
            <li key={index}>
              <strong>Producto:</strong> {item.producto__nombre}
              <p><strong>Cantidad Vendida:</strong> {item.total_vendido}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productos vendidos aún.</p>
      )}
    </div>
  );
};

export default Reportes;