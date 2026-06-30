// ================================
// COMPONENTE: Trucos (Sección de trucos destacados)
// ================================
// ANTES (HTML5): Eran 4 <article> hardcodeados en el HTML
// AHORA (React): Los datos están en un array y .map() genera las tarjetas
//
// VENTAJA: Si quieres agregar un nuevo truco, solo agregas un objeto al array.
// No necesitas copiar y pegar HTML.

import React from 'react';

function Trucos() {

    // DATOS: Antes estaban escritos directamente en el HTML
    // Ahora están en un array de objetos (estructura de datos)
    const trucosData = [
        {
            id: 1,
            juego: 'GTA San Andreas',
            plataforma: 'PlayStation 2',
            trucos: [
                { nombre: 'Vida infinita:', codigo: 'L2, L1, R1, R2, ↑, →, ↓, ←, ○, X, □, △' },
                { nombre: 'Armas set 1:', codigo: 'R1, R2, L1, R2, ←, ↓, →, ↑, ←, ↓, →, ↑' },
                { nombre: 'Dinero + Vida + Armadura:', codigo: 'R1, R2, L1, X, ←, ↓, →, ↑, ←, ↓, →, ↑' }
            ]
        },
        {
            id: 2,
            juego: 'GTA V',
            plataforma: 'PlayStation 4',
            trucos: [
                { nombre: 'Invencibilidad (5 min):', codigo: '→, X, →, ←, →, R1, →, ←, X, △' },
                { nombre: 'Super salto:', codigo: 'L2, L2, □, ○, ○, L2, □, □, ←, →, X' },
                { nombre: 'Cámara lenta:', codigo: '△, ←, →, →, □, R2, R1' }
            ]
        },
        {
            id: 3,
            juego: 'Age of Empires II',
            plataforma: 'PC',
            trucos: [
                { nombre: '+1000 oro:', codigo: 'robin hood' },
                { nombre: '+1000 piedra:', codigo: 'rock on' },
                { nombre: 'Carro cobra:', codigo: 'how do you turn this on' }
            ]
        },
        {
            id: 4,
            juego: 'The Sims 4',
            plataforma: 'PC / Consolas',
            trucos: [
                { nombre: '+50,000 simoleones:', codigo: 'motherlode' },
                { nombre: 'Editar Sims:', codigo: 'cas.fulleditmode' },
                { nombre: 'Necesidades máx:', codigo: 'fillmotive motive_energy' }
            ]
        },
        {
            id: 5,
            juego: 'Minecraft',
            plataforma: 'PC / Consolas',
            trucos: [
                { nombre: 'Modo creativo:', codigo: '/gamemode creative' },
                { nombre: 'Dar ítems:', codigo: '/give @p diamond 64' },
                { nombre: 'Cambiar hora:', codigo: '/time set day' }
            ]
        },
        {
            id: 6,
            juego: 'Skyrim',
            plataforma: 'PC',
            trucos: [
                { nombre: 'Modo dios:', codigo: 'tgm' },
                { nombre: 'Todos los hechizos:', codigo: 'psb' },
                { nombre: 'Atravesar paredes:', codigo: 'tcl' }
            ]
        },
        {
            id: 7,
            juego: 'Red Dead Redemption 2',
            plataforma: 'PlayStation / Xbox',
            trucos: [
                { nombre: 'Munición infinita:', codigo: 'Abundance is the dullest desire' },
                { nombre: 'Dead Eye ilimitado:', codigo: 'Be greedy only for foresight' },
                { nombre: 'Armas pesadas:', codigo: 'Greed is American Virtue' }
            ]
        },
        {
            id: 8,
            juego: 'DOOM (1993)',
            plataforma: 'PC',
            trucos: [
                { nombre: 'Modo dios:', codigo: 'IDDQD' },
                { nombre: 'Todas las armas:', codigo: 'IDKFA' },
                { nombre: 'Atravesar paredes:', codigo: 'IDCLIP' }
            ]
        }
    ];

    return (
        <section id="trucos" className="trucos">
            <h2>&#128273; Trucos Destacados</h2>

            <div className="trucos-grid">
                {/* DIFERENCIA CLAVE:
                    ANTES (HTML5): 4 bloques <article> escritos a mano, uno por uno
                    AHORA (React): .map() recorre el array y genera un <article> por cada truco
                    
                    .map() es como un bucle for que retorna JSX por cada elemento */}
                {trucosData.map((truco) => (
                    <article className="tarjeta-truco" key={truco.id}>
                        <h3>{truco.juego}</h3>
                        <p className="plataforma">{truco.plataforma}</p>
                        <ul className="lista-trucos">
                            {/* .map() anidado: genera un <li> por cada truco del juego */}
                            {truco.trucos.map((t, index) => (
                                <li key={index}>
                                    <strong>{t.nombre}</strong>
                                    {t.codigo}
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Trucos;
