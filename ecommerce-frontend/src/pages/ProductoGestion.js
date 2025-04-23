import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/ProductoGestion.css'; // Crea este archivo CSS

const ProductoGestion = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('access');

    // Estado para controlar formularios de creación/edición de Productos
    const [productoForm, setProductoForm] = useState({ id: null, nombre: '', descripcion: '', precio: '', categoria: '', stock: '' });
    const [isEditingProducto, setIsEditingProducto] = useState(false);

    // Estado para controlar formularios de creación/edición de Categorías
    const [categoriaForm, setCategoriaForm] = useState({ id: null, nombre: '' });
    const [isEditingCategoria, setIsEditingCategoria] = useState(false);

    // Estado para controlar formularios de creación/edición de Proveedores
    const [proveedorForm, setProveedorForm] = useState({ id: null, nombre: '', contacto: '', telefono: '' });
    const [isEditingProveedor, setIsEditingProveedor] = useState(false);

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
        fetchProveedores();
    }, []);

    const authHeader = { Authorization: `Bearer ${token}` };

    // --- Funciones para Productos ---
    const fetchProductos = async () => {
        try {
            const response = await api.get('/productos/');
            setProductos(response.data);
        } catch (err) {
            setError('Error al cargar productos.');
            console.error(err);
        }
    };

    const handleProductoInputChange = (e) => {
        setProductoForm({ ...productoForm, [e.target.name]: e.target.value });
    };

    const handleCrearProducto = async (e) => {
        e.preventDefault();
        try {
            await api.post('/productos/', productoForm, { headers: authHeader });
            setProductoForm({ id: null, nombre: '', descripcion: '', precio: '', categoria: '', stock: '' });
            fetchProductos();
        } catch (err) {
            setError('Error al crear producto.');
            console.error(err.response.data);
        }
    };

    const handleEditarProducto = (producto) => {
        setProductoForm({ ...producto, categoria: producto.categoria.id }); // Set categoria ID para el formulario
        setIsEditingProducto(true);
    };

    const handleActualizarProducto = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/productos/${productoForm.id}/`, productoForm, { headers: authHeader });
            setProductoForm({ id: null, nombre: '', descripcion: '', precio: '', categoria: '', stock: '' });
            setIsEditingProducto(false);
            fetchProductos();
        } catch (err) {
            setError('Error al actualizar producto.');
            console.error(err);
        }
    };

    const handleEliminarProducto = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
            try {
                await api.delete(`/productos/${id}/`, { headers: authHeader });
                fetchProductos();
            } catch (err) {
                setError('Error al eliminar producto.');
                console.error(err);
            }
        }
    };

    // --- Funciones para Categorías ---
    const fetchCategorias = async () => {
        try {
            const response = await api.get('/categorias/');
            setCategorias(response.data);
        } catch (err) {
            setError('Error al cargar categorías.');
            console.error(err);
        }
    };

    const handleCategoriaInputChange = (e) => {
        setCategoriaForm({ ...categoriaForm, [e.target.name]: e.target.value });
    };

    const handleCrearCategoria = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categorias/', categoriaForm, { headers: authHeader });
            setCategoriaForm({ id: null, nombre: '' });
            fetchCategorias();
        } catch (err) {
            setError('Error al crear categoría.');
            console.error(err);
        }
    };

    const handleEditarCategoria = (categoria) => {
        setCategoriaForm(categoria);
        setIsEditingCategoria(true);
    };

    const handleActualizarCategoria = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/categorias/${categoriaForm.id}/`, categoriaForm, { headers: authHeader });
            setCategoriaForm({ id: null, nombre: '' });
            setIsEditingCategoria(false);
            fetchCategorias();
        } catch (err) {
            setError('Error al actualizar categoría.');
            console.error(err);
        }
    };

    const handleEliminarCategoria = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar esta categoría?')) {
            try {
                await api.delete(`/categorias/${id}/`, { headers: authHeader });
                fetchCategorias();
            } catch (err) {
                setError('Error al eliminar categoría.');
                console.error(err);
            }
        }
    };

    // --- Funciones para Proveedores ---
    const fetchProveedores = async () => {
        try {
            const response = await api.get('/proveedores/');
            setProveedores(response.data);
        } catch (err) {
            setError('Error al cargar proveedores.');
            console.error(err);
        }
    };

    const handleProveedorInputChange = (e) => {
        setProveedorForm({ ...proveedorForm, [e.target.name]: e.target.value });
    };

    const handleCrearProveedor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/proveedores/', proveedorForm, { headers: authHeader });
            setProveedorForm({ id: null, nombre: '', contacto: '', telefono: '' });
            fetchProveedores();
        } catch (err) {
            setError('Error al crear proveedor.');
            console.error(err);
        }
    };

    const handleEditarProveedor = (proveedor) => {
        setProveedorForm(proveedor);
        setIsEditingProveedor(true);
    };

    const handleActualizarProveedor = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/proveedores/${proveedorForm.id}/`, proveedorForm, { headers: authHeader });
            setProveedorForm({ id: null, nombre: '', contacto: '', telefono: '' });
            setIsEditingProveedor(false);
            fetchProveedores();
        } catch (err) {
            setError('Error al actualizar proveedor.');
            console.error(err);
        }
    };

    const handleEliminarProveedor = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este proveedor?')) {
            try {
                await api.delete(`/proveedores/${id}/`, { headers: authHeader });
                fetchProveedores();
            } catch (err) {
                setError('Error al eliminar proveedor.');
                console.error(err);
            }
        }
    };

    if (error) {
        return <div className="producto-gestion-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="producto-gestion-container">
            <h1>Gestión de Productos, Categorías y Proveedores</h1>

            {/* --- Sección de Productos --- */}
            <div className="gestion-section">
                <h2>Productos</h2>

                {/* Formulario de Creación/Edición de Productos */}
                <form onSubmit={isEditingProducto ? handleActualizarProducto : handleCrearProducto}>
                    <h3>{isEditingProducto ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
                    <input name="nombre" placeholder="Nombre" value={productoForm.nombre} onChange={handleProductoInputChange} required />
                    <textarea name="descripcion" placeholder="Descripción" value={productoForm.descripcion} onChange={handleProductoInputChange} />
                    <input type="number" name="precio" placeholder="Precio" value={productoForm.precio} onChange={handleProductoInputChange} required />
                    <select name="categoria" value={productoForm.categoria} onChange={handleProductoInputChange} required>
                        <option value="">Seleccionar Categoría</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    <input type="number" name="stock" placeholder="Stock" value={productoForm.stock} onChange={handleProductoInputChange} required />
                    <button className="btn" type="submit">{isEditingProducto ? 'Actualizar Producto' : 'Crear Producto'}</button>
                    {isEditingProducto && <button className="btn" type="button" onClick={() => { setIsEditingProducto(false); setProductoForm({ id: null, nombre: '', descripcion: '', precio: '', categoria: '', stock: '' }); }}>Cancelar Edición</button>}
                </form>

                {/* Lista de Productos */}
                <h3>Lista de Productos</h3>
                {productos.length > 0 ? (
                    <ul className="item-list">
                        {productos.map(producto => (
                            <li key={producto.id}>
                                {producto.nombre} - ${producto.precio} (Stock: {producto.stock}) - Categoría: {producto.categoria.nombre}
                                <div className="actions">
                                    <button className="edit-btn" onClick={() => handleEditarProducto(producto)}>Editar</button>
                                    <button className="delete-btn" onClick={() => handleEliminarProducto(producto.id)}>Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay productos registrados.</p>
                )}
            </div>

            {/* --- Sección de Categorías --- */}
            <div className="gestion-section">
                <h2>Categorías</h2>

                {/* Formulario de Creación/Edición de Categorías */}
                <form onSubmit={isEditingCategoria ? handleActualizarCategoria : handleCrearCategoria}>
                    <h3>{isEditingCategoria ? 'Editar Categoría' : 'Crear Nueva Categoría'}</h3>
                    <input name="nombre" placeholder="Nombre" value={categoriaForm.nombre} onChange={handleCategoriaInputChange} required />
                    <button className="btn" type="submit">{isEditingCategoria ? 'Actualizar Categoría' : 'Crear Categoría'}</button>
                    {isEditingCategoria && <button className="btn" type="button" onClick={() => { setIsEditingCategoria(false); setCategoriaForm({ id: null, nombre: '' }); }}>Cancelar Edición</button>}
                </form>

                {/* Lista de Categorías */}
                <h3>Lista de Categorías</h3>
                {categorias.length > 0 ? (
                    <ul className="item-list">
                        {categorias.map(categoria => (
                            <li key={categoria.id}>
                                {categoria.nombre}
                                <div className="actions">
                                    <button className="edit-btn" onClick={() => handleEditarCategoria(categoria)}>Editar</button>
                                    <button className="delete-btn" onClick={() => handleEliminarCategoria(categoria.id)}>Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay categorías registradas.</p>
                )}
            </div>

            {/* --- Sección de Proveedores --- */}
            <div className="gestion-section">
                <h2>Proveedores</h2>

                {/* Formulario de Creación/Edición de Proveedores */}
                <form onSubmit={isEditingProveedor ? handleActualizarProveedor : handleCrearProveedor}>
                    <h3>{isEditingProveedor ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}</h3>
                    <input name="nombre" placeholder="Nombre" value={proveedorForm.nombre} onChange={handleProveedorInputChange} required />
                    <input name="contacto" placeholder="Contacto" value={proveedorForm.contacto} onChange={handleProveedorInputChange} />
                    <input name="telefono" placeholder="Teléfono" value={proveedorForm.telefono} onChange={handleProveedorInputChange} />
                    <button className="btn" type="submit">{isEditingProveedor ? 'Actualizar Proveedor' : 'Crear Proveedor'}</button>
                    {isEditingProveedor && <button className="btn" type="button" onClick={() => { setIsEditingProveedor(false); setProveedorForm({ id: null, nombre: '', contacto: '', telefono: '' }); }}>Cancelar Edición</button>}
                </form>

                {/* Lista de Proveedores */}
                <h3>Lista de Proveedores</h3>
                {proveedores.length > 0 ? (
                    <ul className="item-list">
                        {proveedores.map(proveedor => (
                            <li key={proveedor.id}>
                                {proveedor.nombre} - Contacto: {proveedor.contacto} - Teléfono: {proveedor.telefono}
                                <div className="actions">
                                    <button className="edit-btn" onClick={() => handleEditarProveedor(proveedor)}>Editar</button>
                                    <button className="delete-btn" onClick={() => handleEliminarProveedor(proveedor.id)}>Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay proveedores registrados.</p>
                )}
            </div>
        </div>
    );
};

export default ProductoGestion;