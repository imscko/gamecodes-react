// ================================
// COMPONENTE: Carrito (Carrito de compras)
// ================================
// Muestra los productos agregados al carrito con controles de cantidad,
// subtotales y total en CLP. Permite eliminar productos y vaciar el carrito.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatearPrecioCLP } from '../utils/igdbApi.js';

function Carrito({ carrito, productos, actualizarCantidad, quitarDelCarrito, vaciarCarrito }) {

    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [compraExitosa, setCompraExitosa] = useState(false);

    // Construir items del carrito con datos completos del producto
    const itemsCarrito = carrito
        .map(item => {
            const producto = productos.find(p => p.id === item.productoId);
            if (!producto) return null;
            return {
                ...item,
                producto,
                subtotal: producto.precioCLP * item.cantidad,
            };
        })
        .filter(Boolean);

    // Total del carrito
    const totalCLP = itemsCarrito.reduce((acc, item) => acc + item.subtotal, 0);
    const totalItems = itemsCarrito.reduce((acc, item) => acc + item.cantidad, 0);

    // Finalizar compra (simulado)
    const handleFinalizarCompra = () => {
        setCompraExitosa(true);
        vaciarCarrito();
        setTimeout(() => {
            setCompraExitosa(false);
            setMostrarConfirmacion(false);
        }, 4000);
    };

    if (compraExitosa) {
        return (
            <main className="carrito-page" id="contenido-principal">
                <div className="compra-exitosa">
                    <span className="compra-icono">🎉</span>
                    <h2>¡Compra Exitosa!</h2>
                    <p>Tu pedido ha sido procesado. Recibirás tus códigos de juego por correo electrónico.</p>
                    <p>¡Gracias por comprar en GameCodes!</p>
                    <Link to="/tienda" className="btn-volver-tienda">Seguir comprando</Link>
                </div>
            </main>
        );
    }

    if (itemsCarrito.length === 0) {
        return (
            <main className="carrito-page" id="contenido-principal">
                <h1>🛒 Tu Carrito</h1>
                <div className="carrito-vacio">
                    <span className="carrito-vacio-icono">🛒</span>
                    <p>Tu carrito está vacío</p>
                    <Link to="/tienda" className="btn-volver-tienda">Ir a la tienda</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="carrito-page" id="contenido-principal">
            <h1>🛒 Tu Carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</h1>

            <div className="carrito-contenido">
                {/* Lista de items */}
                <div className="carrito-items">
                    {itemsCarrito.map(item => (
                        <div className="carrito-item" key={item.productoId}>
                            <div className="carrito-item-imagen">
                                {item.producto.imagen ? (
                                    <img src={item.producto.imagen} alt={item.producto.nombre} loading="lazy" />
                                ) : (
                                    <div className="producto-imagen-placeholder">🎮</div>
                                )}
                            </div>
                            <div className="carrito-item-info">
                                <h3>{item.producto.nombre}</h3>
                                <div className="carrito-item-plataformas">
                                    {item.producto.plataformas.slice(0, 3).map((plat, i) => (
                                        <span key={i} className="badge-plataforma-sm">{plat}</span>
                                    ))}
                                </div>
                                <p className="carrito-item-precio-unit">
                                    {formatearPrecioCLP(item.producto.precioCLP)} c/u
                                </p>
                            </div>
                            <div className="carrito-item-cantidad">
                                <button
                                    className="btn-cantidad"
                                    onClick={() => actualizarCantidad(item.productoId, item.cantidad - 1)}
                                    disabled={item.cantidad <= 1}
                                    aria-label="Reducir cantidad"
                                >
                                    −
                                </button>
                                <span className="cantidad-valor">{item.cantidad}</span>
                                <button
                                    className="btn-cantidad"
                                    onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)}
                                    aria-label="Aumentar cantidad"
                                >
                                    +
                                </button>
                            </div>
                            <div className="carrito-item-subtotal">
                                <span className="subtotal-label">Subtotal</span>
                                <span className="subtotal-valor">{formatearPrecioCLP(item.subtotal)}</span>
                            </div>
                            <button
                                className="btn-eliminar-item"
                                onClick={() => quitarDelCarrito(item.productoId)}
                                aria-label={`Eliminar ${item.producto.nombre} del carrito`}
                                title="Eliminar"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>

                {/* Resumen del pedido */}
                <aside className="carrito-resumen">
                    <h2>Resumen del Pedido</h2>
                    <div className="resumen-linea">
                        <span>Productos ({totalItems})</span>
                        <span>{formatearPrecioCLP(totalCLP)}</span>
                    </div>
                    <div className="resumen-linea">
                        <span>Envío digital</span>
                        <span className="envio-gratis">GRATIS</span>
                    </div>
                    <hr />
                    <div className="resumen-total">
                        <span>Total</span>
                        <span className="total-valor">{formatearPrecioCLP(totalCLP)}</span>
                    </div>
                    <button
                        className="btn-finalizar-compra"
                        onClick={() => setMostrarConfirmacion(true)}
                    >
                        💳 Finalizar Compra
                    </button>
                    <button
                        className="btn-vaciar-carrito"
                        onClick={vaciarCarrito}
                    >
                        🗑️ Vaciar Carrito
                    </button>
                    <Link to="/tienda" className="btn-seguir-comprando">
                        ← Seguir comprando
                    </Link>
                </aside>
            </div>

            {/* Modal de confirmación */}
            {mostrarConfirmacion && (
                <div className="modal-overlay" onClick={() => setMostrarConfirmacion(false)}>
                    <div className="modal-contenido" onClick={e => e.stopPropagation()}>
                        <h3>Confirmar Compra</h3>
                        <p>¿Confirmar compra por <strong>{formatearPrecioCLP(totalCLP)}</strong>?</p>
                        <p className="modal-detalle">{totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu pedido</p>
                        <div className="modal-acciones">
                            <button className="btn-confirmar" onClick={handleFinalizarCompra}>
                                ✅ Confirmar
                            </button>
                            <button className="btn-cancelar" onClick={() => setMostrarConfirmacion(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Carrito;
