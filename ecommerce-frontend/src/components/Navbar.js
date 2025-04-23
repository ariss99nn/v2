import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const esEmpleado = user?.rol === "EMPLOYEE";
  const esAdmin = user?.rol === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Mi eCommerce</h1>
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/carrito">Carrito</Link></li>

        {/* Mostrar el enlace de perfil solo si el usuario está logueado */}
        {user && (
          <li><Link to="/perfil">Perfil</Link></li>
        )}

        {/* Links exclusivos para Admin o Empleado */}
        {(esEmpleado || esAdmin) && (
          <>
            <li><Link to="/ProductoGestion">Gestionar Productos</Link></li>
            <li><Link to="/Inventario">Inventario</Link></li>
            <li><Link to="/Reportes">Reportes</Link></li>
          </>
        )}

        <li>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>
                <strong>{user.username}</strong> (<em>{user.rol}</em>)
              </span>
              <button className="btn" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          ) : (
            <Link to="/login">Iniciar Sesión</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;