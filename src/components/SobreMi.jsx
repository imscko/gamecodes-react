// ================================
// COMPONENTE: SobreMi (Sección Sobre Mí)
// ================================
// Este componente es casi idéntico al HTML original.
// La diferencia principal es que usa className en vez de class.

import React from 'react';

function SobreMi() {
    return (
        <section id="sobre-mi" className="sobre-mi">
            <h2>&#128126; Sobre Mí</h2>
            <div className="sobre-mi-contenido">
                {/* Texto a la izquierda */}
                <div className="sobre-mi-texto">
                    <p>
                        ¡Hola! Soy <strong>Iván</strong>. Crecí buscando trucos, códigos secretos y claves para
                        desbloquear todo lo oculto
                        en mis juegos favoritos.
                    </p>
                    <p>
                        Desde los clásicos como <strong>GTA San Andreas</strong> en PS2 hasta los juegos modernos,
                        siempre me ha fascinado descubrir esos secretos que los desarrolladores
                        esconden para los jugadores más curiosos.
                    </p>
                    <p>
                        Esta web es mi espacio para compartir esos trucos que tanto me gustan
                        y conectar con otros gamers que comparten la misma pasión.
                    </p>
                </div>
                {/* Imagen a la derecha */}
                <div className="sobre-mi-imagen">
                    <img src="/imagenes/iconos o logo/Usuario-ROot.png" alt="Foto de perfil de Iván, creador de GameCodes" />
                </div>
            </div>
        </section>
    );
}

export default SobreMi;
