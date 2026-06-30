// ================================
// COMPONENTE: Bienvenida (Barra de bienvenida del usuario logueado)
// ================================
// ANTES (HTML5): sesion.js mostraba/ocultaba la barra con style.display
// AHORA (React): Si el componente recibe un usuario, se muestra automáticamente

import React, { useState, useEffect } from 'react';

function Bienvenida({ usuario }) {
    // Estado para controlar si la barra está visible
    const [visible, setVisible] = useState(true);

    // Resetear visibilidad cada vez que el usuario inicie sesión
    useEffect(() => {
        if (usuario) {
            setVisible(true);
        }
    }, [usuario]);

    // Si no hay usuario o la barra fue cerrada, no renderizar nada
    if (!usuario || !visible) return null;

    // Obtener nombre (soportar objeto y string legacy)
    const nombre = typeof usuario === 'string' ? usuario : usuario.nombre;
    const esAdmin = typeof usuario === 'object' && usuario.rol === 'admin';

    return (
        <div className="barra-bienvenida" role="status">
            <span aria-live="assertive">
                ¡Hola! {nombre} 🎮
                {esAdmin && <span className="badge-admin">👑 Admin</span>}
            </span>
            <button
                className="cerrar-bienvenida"
                aria-label="Cerrar barra de bienvenida"
                onClick={() => setVisible(false)}
            >
                &times;
            </button>
        </div>
    );
}

export default Bienvenida;
