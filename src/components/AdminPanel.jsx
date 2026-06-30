// ================================
// COMPONENTE: AdminPanel (Panel de administración)
// ================================
// Solo accesible por el admin (rol: 'admin').
// Permite buscar juegos en RAWG API, publicarlos en la tienda con precio CLP,
// y gestionar (editar precio / eliminar) los productos publicados.

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { buscarJuegos, formatearProducto, formatearPrecioCLP } from '../utils/igdbApi.js';

function AdminPanel({ usuario, productos, onPublicar, onEditarPrecio, onEliminar }) {

    // Protección: solo admin puede acceder
    if (!usuario || usuario.rol !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Estados para búsqueda en RAWG
    const [queryRawg, setQueryRawg] = useState('');
    const [resultadosRawg, setResultadosRawg] = useState([]);
    const [buscando, setBuscando] = useState(false);
    const [errorBusqueda, setErrorBusqueda] = useState('');

    // Estado para el modal de publicar
    const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
    const [precioInput, setPrecioInput] = useState('');

    // Estado para editar precio inline
    const [editandoId, setEditandoId] = useState(null);
    const [editPrecio, setEditPrecio] = useState('');

    // Estado para confirmación de eliminación
    const [eliminandoId, setEliminandoId] = useState(null);

    // Buscar en RAWG
    const handleBuscarRawg = async (e) => {
        e.preventDefault();
        if (!queryRawg.trim()) return;
        setBuscando(true);
        setErrorBusqueda('');
        try {
            const resultados = await buscarJuegos(queryRawg.trim());
            setResultadosRawg(resultados);
            if (resultados.length === 0) {
                setErrorBusqueda('No se encontraron juegos para "' + queryRawg + '"');
            }
        } catch (err) {
            setErrorBusqueda('Error al buscar. Verifica tu API key de RAWG.');
        }
        setBuscando(false);
    };

    // Publicar juego en la tienda
    const handlePublicar = () => {
        const precio = parseInt(precioInput);
        if (!precio || precio <= 0) return;
        const producto = formatearProducto(juegoSeleccionado, precio);
        onPublicar(producto);
        setJuegoSeleccionado(null);
        setPrecioInput('');
    };

    // Guardar edición de precio
    const handleGuardarPrecio = (productoId) => {
        const precio = parseInt(editPrecio);
        if (!precio || precio <= 0) return;
        onEditarPrecio(productoId, precio);
        setEditandoId(null);
        setEditPrecio('');
    };

    // Verificar si un juego de RAWG ya está publicado
    const estaPublicado = (rawgId) => {
        return productos.some(p => p.rawgId === rawgId);
    };

    // Estadísticas
    const totalProductos = productos.length;
    const plataformasCount = {};
    productos.forEach(p => {
        p.plataformas.forEach(plat => {
            const grupo = plat.includes('PlayStation') ? 'PlayStation' :
                plat.includes('Xbox') ? 'Xbox' :
                    plat.includes('Nintendo') || plat.includes('Switch') ? 'Nintendo' : 'PC';
            plataformasCount[grupo] = (plataformasCount[grupo] || 0) + 1;
        });
    });

    return (
        <main className="admin-panel" id="contenido-principal">
            <div className="admin-header">
                <h1>⚙️ Panel de Administración</h1>
                <p className="admin-subtitulo">Gestiona el catálogo de la tienda</p>
            </div>

            {/* Estadísticas */}
            <div className="admin-stats">
                <div className="stat-card">
                    <span className="stat-numero">{totalProductos}</span>
                    <span className="stat-label">Productos</span>
                </div>
                {Object.entries(plataformasCount).map(([plat, count]) => (
                    <div className="stat-card" key={plat}>
                        <span className="stat-numero">{count}</span>
                        <span className="stat-label">{plat}</span>
                    </div>
                ))}
            </div>

            {/* Sección 1: Buscar en RAWG */}
            <section className="admin-seccion">
                <h2>🔍 Buscar juegos en RAWG</h2>
                <form className="admin-busqueda-form" onSubmit={handleBuscarRawg}>
                    <input
                        type="text"
                        placeholder="Ej: GTA V, Elden Ring, Minecraft..."
                        value={queryRawg}
                        onChange={(e) => setQueryRawg(e.target.value)}
                        className="admin-input-busqueda"
                    />
                    <button type="submit" className="btn-buscar-rawg" disabled={buscando}>
                        {buscando ? '⏳ Buscando...' : '🔍 Buscar'}
                    </button>
                </form>

                {errorBusqueda && <p className="admin-error">{errorBusqueda}</p>}

                {resultadosRawg.length > 0 && (
                    <div className="rawg-resultados">
                        {resultadosRawg.map(juego => (
                            <div className="rawg-card" key={juego.id}>
                                <div className="rawg-card-img">
                                    {juego.cover && juego.cover.url ? (
                                        <img src={juego.cover.url.startsWith('//') ? 'https:' + juego.cover.url.replace('t_thumb', 't_cover_big') : juego.cover.url} alt={juego.name} loading="lazy" />
                                    ) : (
                                        <div className="producto-imagen-placeholder">🎮</div>
                                    )}
                                </div>
                                <div className="rawg-card-info">
                                    <h4>{juego.name}</h4>
                                    <p className="rawg-plataformas">
                                        {juego.platforms?.map(p => p.name).slice(0, 4).join(', ') || 'N/A'}
                                    </p>
                                    <p className="rawg-rating">⭐ {((juego.total_rating || juego.rating || 0) / 20).toFixed(1)}</p>
                                    {juego.first_release_date && <p className="rawg-fecha">📅 {new Date(juego.first_release_date * 1000).toISOString().split('T')[0]}</p>}
                                </div>
                                <div className="rawg-card-acciones">
                                    {estaPublicado(juego.id) ? (
                                        <span className="ya-publicado">✅ Publicado</span>
                                    ) : (
                                        <button
                                            className="btn-publicar"
                                            onClick={() => { setJuegoSeleccionado(juego); setPrecioInput(''); }}
                                        >
                                            ➕ Publicar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Sección 2: Productos publicados */}
            <section className="admin-seccion">
                <h2>📦 Productos Publicados ({totalProductos})</h2>
                {productos.length === 0 ? (
                    <p className="admin-vacio">No hay productos publicados. Busca juegos en RAWG para agregarlos.</p>
                ) : (
                    <div className="admin-tabla-container">
                        <table className="admin-tabla">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Plataformas</th>
                                    <th>Rating</th>
                                    <th>Precio CLP</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(prod => (
                                    <tr key={prod.id}>
                                        <td>
                                            <div className="admin-tabla-img">
                                                {prod.imagen ? (
                                                    <img src={prod.imagen} alt={prod.nombre} />
                                                ) : '🎮'}
                                            </div>
                                        </td>
                                        <td className="admin-tabla-nombre">{prod.nombre}</td>
                                        <td className="admin-tabla-plat">
                                            {prod.plataformas.slice(0, 3).join(', ')}
                                        </td>
                                        <td>⭐ {prod.rating.toFixed(1)}</td>
                                        <td>
                                            {editandoId === prod.id ? (
                                                <div className="editar-precio-inline">
                                                    <input
                                                        type="number"
                                                        value={editPrecio}
                                                        onChange={(e) => setEditPrecio(e.target.value)}
                                                        className="input-precio-inline"
                                                        min="1"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleGuardarPrecio(prod.id)} className="btn-guardar-inline">✅</button>
                                                    <button onClick={() => setEditandoId(null)} className="btn-cancelar-inline">❌</button>
                                                </div>
                                            ) : (
                                                <span className="precio-display">{formatearPrecioCLP(prod.precioCLP)}</span>
                                            )}
                                        </td>
                                        <td className="admin-acciones">
                                            <button
                                                className="btn-editar"
                                                onClick={() => { setEditandoId(prod.id); setEditPrecio(prod.precioCLP.toString()); }}
                                                title="Editar precio"
                                            >
                                                ✏️
                                            </button>
                                            {eliminandoId === prod.id ? (
                                                <span className="confirmar-eliminar">
                                                    ¿Seguro?
                                                    <button onClick={() => { onEliminar(prod.id); setEliminandoId(null); }} className="btn-si">Sí</button>
                                                    <button onClick={() => setEliminandoId(null)} className="btn-no">No</button>
                                                </span>
                                            ) : (
                                                <button
                                                    className="btn-eliminar"
                                                    onClick={() => setEliminandoId(prod.id)}
                                                    title="Eliminar producto"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Modal para asignar precio */}
            {juegoSeleccionado && (
                <div className="modal-overlay" onClick={() => setJuegoSeleccionado(null)}>
                    <div className="modal-contenido modal-publicar" onClick={e => e.stopPropagation()}>
                        <h3>Publicar en Tienda</h3>
                        <div className="modal-juego-preview">
                            {juegoSeleccionado.cover && juegoSeleccionado.cover.url && (
                                <img src={juegoSeleccionado.cover.url.startsWith('//') ? 'https:' + juegoSeleccionado.cover.url.replace('t_thumb', 't_cover_big') : juegoSeleccionado.cover.url} alt={juegoSeleccionado.name} />
                            )}
                            <div>
                                <h4>{juegoSeleccionado.name}</h4>
                                <p>{juegoSeleccionado.platforms?.map(p => p.name).slice(0, 4).join(', ')}</p>
                                <p>⭐ {((juegoSeleccionado.total_rating || juegoSeleccionado.rating || 0) / 20).toFixed(1)}</p>
                            </div>
                        </div>
                        <label className="modal-label">
                            Precio en CLP:
                            <input
                                type="number"
                                value={precioInput}
                                onChange={(e) => setPrecioInput(e.target.value)}
                                placeholder="Ej: 14990"
                                className="modal-input-precio"
                                min="1"
                                autoFocus
                            />
                        </label>
                        {precioInput && parseInt(precioInput) > 0 && (
                            <p className="modal-precio-preview">
                                Precio: <strong>{formatearPrecioCLP(parseInt(precioInput))}</strong>
                            </p>
                        )}
                        <div className="modal-acciones">
                            <button
                                className="btn-confirmar"
                                onClick={handlePublicar}
                                disabled={!precioInput || parseInt(precioInput) <= 0}
                            >
                                ✅ Publicar
                            </button>
                            <button className="btn-cancelar" onClick={() => setJuegoSeleccionado(null)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AdminPanel;
