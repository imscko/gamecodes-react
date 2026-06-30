// ================================
// COMPONENTE: Redes (Sección de Redes Sociales)
// ================================

import React from 'react';

function Redes() {
    return (
        <section id="redes" className="redes">
            <h2>&#127760; Mis Redes Sociales</h2>
            <p className="redes-descripcion" aria-hidden="true">↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓</p>

            <div className="redes-grid">
                {/* Tarjeta Instagram */}
                <a href="https://www.instagram.com/im.scko/" className="red-tarjeta instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Iván: @im.scko (se abre en nueva pestaña)">
                    <span className="red-icono" aria-hidden="true">&#128247;</span>
                    <span className="red-nombre">Instagram</span>
                    <span className="red-usuario">@im.scko</span>
                    <span className="red-detalle">Personal.</span>
                </a>

                {/* Tarjeta Discord */}
                <a href="https://discord.gg/543536992106053643" className="red-tarjeta discord" target="_blank" rel="noopener noreferrer" aria-label="Discord de Iván: sambadojaneiro#3858 (se abre en nueva pestaña)">
                    <span className="red-icono" aria-hidden="true">&#128172;</span>
                    <span className="red-nombre">Discord</span>
                    <span className="red-usuario">sambadojaneiro#3858</span>
                    <span className="red-detalle">Personal.</span>
                </a>
            </div>
        </section>
    );
}

export default Redes;
