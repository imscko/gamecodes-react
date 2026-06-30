// ================================
// COMPONENTE: Tienda (Catálogo de juegos con datos de RAWG API)
// ================================
// Muestra los productos que el admin ha publicado en la tienda.
// Los datos de cada juego (imagen, plataformas, rating) vienen de RAWG.
// Los precios en CLP los asigna el admin.

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatearPrecioCLP } from '../utils/igdbApi.js';

function Tienda({ productos, agregarAlCarrito, usuario }) {

    // Estado para búsqueda y filtro
    const [busqueda, setBusqueda] = useState('');
    const [filtroPlataforma, setFiltroPlataforma] = useState('Todos');

    // Plataformas únicas disponibles en los productos
    const plataformasDisponibles = useMemo(() => {
        const todas = new Set();
        productos.forEach(p => {
            p.plataformas.forEach(plat => {
                // Agrupar plataformas similares
                if (plat.includes('PlayStation')) todas.add('PlayStation');
                else if (plat.includes('Xbox')) todas.add('Xbox');
                else if (plat.includes('Nintendo') || plat.includes('Switch')) todas.add('Nintendo');
                else if (plat.includes('PC') || plat.includes('Steam')) todas.add('PC');
                else todas.add(plat);
            });
        });
        return ['Todos', ...Array.from(todas).sort()];
    }, [productos]);

    // Filtrar productos
    const productosFiltrados = useMemo(() => {
        return productos.filter(p => {
            // Filtro por búsqueda
            const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
            // Filtro por plataforma
            const coincidePlataforma = filtroPlataforma === 'Todos' ||
                p.plataformas.some(plat => plat.toLowerCase().includes(filtroPlataforma.toLowerCase()));
            return coincideBusqueda && coincidePlataforma;
        });
    }, [productos, busqueda, filtroPlataforma]);

    // Feedback visual al agregar al carrito
    const [agregadoId, setAgregadoId] = useState(null);
    const handleAgregar = (producto) => {
        agregarAlCarrito(producto);
        setAgregadoId(producto.id);
        setTimeout(() => setAgregadoId(null), 1200);
    };

    return (
        <main className="tienda-page" id="contenido-principal">
            <div className="tienda-header">
                <h1>🛒 Tienda de Juegos</h1>
                <p className="tienda-subtitulo">Los mejores títulos a los mejores precios en CLP</p>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="tienda-controles">
                <div className="tienda-busqueda">
                    <input
                        type="text"
                        placeholder="🔍 Buscar juegos..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="tienda-input-busqueda"
                        aria-label="Buscar juegos"
                    />
                </div>
                <div className="tienda-filtros">
                    {plataformasDisponibles.map(plat => (
                        <button
                            key={plat}
                            className={`filtro-btn ${filtroPlataforma === plat ? 'filtro-activo' : ''}`}
                            onClick={() => setFiltroPlataforma(plat)}
                        >
                            {plat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de productos */}
            {productosFiltrados.length === 0 ? (
                <div className="tienda-vacia">
                    <p>😔 No se encontraron juegos{busqueda ? ` para "${busqueda}"` : ''}.</p>
                    {busqueda && (
                        <button onClick={() => setBusqueda('')} className="btn-limpiar-busqueda">
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            ) : (
                <div className="tienda-grid">
                    {productosFiltrados.map(producto => (
                        <article className="producto-card" key={producto.id}>
                            <div className="producto-imagen-container">
                                {producto.imagen ? (
                                    <img
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        className="producto-imagen"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="producto-imagen-placeholder">🎮</div>
                                )}
                                {producto.metacritic && (
                                    <span className={`metacritic-badge ${producto.metacritic >= 75 ? 'mc-verde' : producto.metacritic >= 50 ? 'mc-amarillo' : 'mc-rojo'}`}>
                                        {producto.metacritic}
                                    </span>
                                )}
                            </div>
                            <div className="producto-info">
                                <h3 className="producto-nombre">{producto.nombre}</h3>
                                <div className="producto-plataformas">
                                    {producto.plataformas.slice(0, 4).map((plat, i) => (
                                        <span key={i} className={`badge-plataforma ${plat.includes('PlayStation') ? 'badge-ps' : plat.includes('Xbox') ? 'badge-xbox' : plat.includes('Nintendo') || plat.includes('Switch') ? 'badge-nintendo' : 'badge-pc'}`}>
                                            {plat.includes('PlayStation') ? 'PS' : plat.includes('Xbox') ? 'Xbox' : plat.includes('Nintendo') ? 'Switch' : 'PC'}
                                        </span>
                                    ))}
                                </div>
                                <div className="producto-rating">
                                    {'⭐'.repeat(Math.round(producto.rating))}
                                    <span className="rating-numero">{producto.rating.toFixed(1)}</span>
                                </div>
                                <div className="producto-precio">
                                    {formatearPrecioCLP(producto.precioCLP)}
                                </div>
                                <button
                                    className={`btn-agregar-carrito ${agregadoId === producto.id ? 'btn-agregado' : ''}`}
                                    onClick={() => handleAgregar(producto)}
                                >
                                    {agregadoId === producto.id ? '✅ ¡Agregado!' : '🛒 Agregar al carrito'}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Info de la tienda */}
            <div className="tienda-info">
                <p>📦 Envío digital inmediato · 🔒 Pago seguro · 💬 Soporte 24/7</p>
            </div>
        </main>
    );
}

export default Tienda;
