// ================================
// COMPONENTE: Header (Navegación principal)
// ================================
// ANTES (HTML5): Este era el <header> fijo dentro de index.html
// AHORA (React): Es un componente reutilizable que recibe datos por "props"
//
// DIFERENCIA CLAVE:
// - HTML5: usábamos document.getElementById("btnLogout") para ocultar/mostrar botones
// - React: usamos props y renderizado condicional {condición && <elemento>}

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// "function Header({ usuario, onLogout })" recibe PROPS del componente padre (App)
// Props = propiedades que el padre le pasa al hijo, como parámetros de una función
function Header({ usuario, onLogout, totalCarrito }) {

    // Estado para abrir/cerrar el dropdown
    const [dropdownAbierto, setDropdownAbierto] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickFuera(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownAbierto(false);
            }
        }
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, []);

    // Verificar si es admin
    const esAdmin = usuario && usuario.rol === 'admin';

    return (
        <header role="banner">
            <Link to="/" className="logo" aria-label="GameCodes - Ir al inicio">
                <span className="logo-icon" aria-hidden="true">&#127918;</span>
                <span className="logo-texto">GameCodes</span>
            </Link>

            {/* Menú de navegación */}
            <nav aria-label="Navegación principal">
                <ul>
                    <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Inicio</Link></li>
                    <li><a href="#trucos">Trucos</a></li>
                    <li><Link to="/tienda">Tienda 🛒</Link></li>
                    <li>
                        <Link to="/carrito" className="nav-carrito">
                            Carrito 🛒
                            {totalCarrito > 0 && (
                                <span className="carrito-badge">{totalCarrito}</span>
                            )}
                        </Link>
                    </li>

                    {/* DROPDOWN: Agrupa Registro, Login, Admin, Contacto Form y Cerrar Sesión */}
                    <li className="dropdown" ref={dropdownRef}>
                        <button 
                            className="boton-registro dropdown-toggle"
                            onClick={() => setDropdownAbierto(!dropdownAbierto)}
                            aria-expanded={dropdownAbierto}
                            aria-haspopup="true"
                        >
                            {esAdmin ? 'Admin 👑' : 'Mi Cuenta'} ▾
                        </button>

                        {dropdownAbierto && (
                            <ul className="dropdown-menu">
                                {!usuario && (
                                    <>
                                        <li>
                                            <Link to="/registro" onClick={() => setDropdownAbierto(false)}>
                                                Registro 📝
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/login" onClick={() => setDropdownAbierto(false)}>
                                                Login 🔑
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {esAdmin && (
                                    <li>
                                        <Link to="/admin" onClick={() => setDropdownAbierto(false)}>
                                            Admin Panel ⚙️
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link to="/contacto" onClick={() => setDropdownAbierto(false)}>
                                        Contacto Form 📩
                                    </Link>
                                </li>
                                {usuario && (
                                    <li>
                                        <a 
                                            href="#" 
                                            className="dropdown-logout"
                                            onClick={(e) => { onLogout(e); setDropdownAbierto(false); }}
                                        >
                                            Cerrar Sesión 🚪
                                        </a>
                                    </li>
                                )}
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}

// export default permite que otros archivos importen este componente
// Ej: import Header from './components/Header';
export default Header;
