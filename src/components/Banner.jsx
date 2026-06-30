// ================================
// COMPONENTE: Banner (Hero section)
// ================================
// ANTES (HTML5): Era la <section id="inicio" class="banner"> en index.html
// AHORA (React): Es un componente que importa el Carrusel como componente hijo

import React, { useEffect, useState } from 'react';
import Carrusel from './Carrusel.jsx';

const NUM_PARTICULAS = 40;

function Banner() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: NUM_PARTICULAS }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 80 + 40; // Distancia de explosión
            return {
                id: i,
                left: 50 + (Math.random() * 60 - 30), // Posición inicial X (%)
                top: 50 + (Math.random() * 40 - 20),  // Posición inicial Y (%)
                dirX: Math.cos(angle) * distance,     // Dirección X
                dirY: Math.sin(angle) * distance,     // Dirección Y
                size: Math.random() * 6 + 2,          // Tamaño (px)
                delay: Math.random() * 2,             // Retraso animación
                duration: Math.random() * 2 + 1.5,    // Duración animación
                color: Math.random() > 0.5 ? '#00f3ff' : '#ff003c' // Cyan o Magenta
            };
        });
        setParticles(newParticles);
    }, []);

    return (
        <section id="inicio" className="banner">
            <div className="titulo-container">
                <h1>Trucos y Claves de Videojuegos</h1>
                {particles.map(p => (
                    <span 
                        key={p.id} 
                        className="particula-neon"
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            backgroundColor: p.color,
                            boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}`,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`,
                            '--dir-x': `${p.dirX}px`,
                            '--dir-y': `${p.dirY}px`
                        }}
                    />
                ))}
            </div>
            <p>Los mejores códigos secretos para desbloquear todo en tus juegos favoritos.</p>
            
            <Carrusel />
        </section>
    );
}

export default Banner;
