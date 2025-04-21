import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React from "react";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Inventario from "./pages/Inventario";
import Carrito from "./pages/Carrito";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductoDetalle from "./pages/ProductoDetalle";
import Registro from "./pages/Registro";
import ProductosCategoria from "./pages/ProductoCategoria";
import Venta from "./pages/Venta";
import Reportes from "./pages/Reportes"
import ProductoGestion from "./pages/ProductoGestion";
import FinalizarCompra from "./pages/FinalizarCompra";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div style={{ minHeight: "90vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/categoria/:categoriaId" element={<ProductosCategoria />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/productodetalle" element={<ProductoDetalle />} />
            <Route path="/reportes" element={<Reportes/>} />
            <Route path="/productogestion" element={<ProductoGestion/>}/>
            <Route path="/venta" element={<Venta />} />
            <Route path ="/finalizarcompra" element={<FinalizarCompra/>}/>
          </Routes>
        </div>
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;