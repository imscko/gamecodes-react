// ================================
// COMPONENTE: Carrusel (Carrusel de imágenes)
// ================================
// ANTES (HTML5 + JS puro): carrusel.js usaba document.querySelectorAll,
//   classList.add/remove, y setInterval para autoplay
// AHORA (React): usamos useState para el índice y useEffect para el autoplay
//
// DIFERENCIA CLAVE:
// - HTML5: var slides = document.querySelectorAll(".carrusel-slide");
//          slides[i].classList.remove("activo");
// - React: const [indiceActual, setIndiceActual] = useState(0);
//          className={i === indiceActual ? 'activo' : ''}

import React, { useState, useEffect, useCallback } from 'react';

function Carrusel() {

    // DATOS DEL CARRUSEL (antes estaban hardcodeados en el HTML)
    // En React, los datos se definen como un array de objetos
    const slides = [
        {
            imagen: '/imagenes/iconos o logo/Usuario-ROot.png',
            alt: 'Hacker Root - Acceso total al sistema',
            titulo: '#root',
            descripcion: 'Acceso total al sistema'
        },
        {
            imagen: '/imagenes/iconos o logo/hackerman.ico',
            alt: 'Hackerman - El hacker definitivo',
            titulo: 'HACKERMAN',
            descripcion: 'El hacker definitivo'
        },
        {
            imagen: '/imagenes/iconos o logo/gaming-controller.png',
            alt: 'Gaming Controller - Controles de videojuegos',
            titulo: 'GAME ON',
            descripcion: 'Los mejores trucos a tu alcance'
        }
    ];

    // ================================
    // useState: REEMPLAZO DE VARIABLES GLOBALES
    // ================================
    // ANTES (JS puro): var indiceActual = 0; var autoplayActivo = true;
    // AHORA (React):   const [indiceActual, setIndiceActual] = useState(0);
    //
    // useState retorna un array con 2 elementos:
    // [0] = el valor actual del estado
    // [1] = la función para actualizarlo
    // Cuando llamas a setIndiceActual(), React RE-RENDERIZA el componente automáticamente
    const [indiceActual, setIndiceActual] = useState(0);
    const [autoplayActivo, setAutoplayActivo] = useState(true);

    // ================================
    // FUNCIONES DE NAVEGACIÓN
    // ================================
    // ANTES: function irSiguiente() { cambiarImagen(nuevoIndice); }
    // AHORA: Simplemente actualizamos el estado y React se encarga del DOM

    const irSiguiente = useCallback(() => {
        setIndiceActual((prev) => {
            if (prev === slides.length - 1) {
                return 0;  // Volver al primero
            }
            return prev + 1;
        });
    }, [slides.length]);

    const irAnterior = () => {
        setIndiceActual((prev) => {
            if (prev === 0) {
                return slides.length - 1;  // Ir al último
            }
            return prev - 1;
        });
    };

    // ================================
    // useEffect: REEMPLAZO DE setInterval / addEventListener
    // ================================
    // ANTES: var intervalId = setInterval(irSiguiente, 4000);
    // AHORA: useEffect se ejecuta cuando el componente se monta (aparece en pantalla)
    //        y se limpia automáticamente cuando se desmonta (desaparece)
    useEffect(() => {
        if (!autoplayActivo) return; // Si está pausado, no hacer nada

        const intervalId = setInterval(irSiguiente, 4000);

        // CLEANUP: React llama a esta función cuando el componente se desmonta
        // o cuando autoplayActivo cambia. Equivale a clearInterval()
        return () => clearInterval(intervalId);
    }, [autoplayActivo, irSiguiente]);

    // Alternar pausa/reproducir
    const toggleAutoplay = () => {
        setAutoplayActivo((prev) => !prev);
    };

    // ================================
    // JSX: REEMPLAZO DEL HTML ESTÁTICO
    // ================================
    // ANTES: HTML estático con 3 divs hardcodeados
    // AHORA: .map() genera los slides dinámicamente desde el array de datos
    return (
        <section className="carrusel-header" aria-roledescription="carrusel" aria-label="Imágenes destacadas del sitio">
            <div className="carrusel-contenedor">
                {/* DIFERENCIA: en vez de 3 divs hardcodeados en HTML,
                    .map() recorre el array y genera un div por cada slide */}
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className={`carrusel-slide ${i === indiceActual ? 'activo' : ''}`}
                        role="group"
                        aria-roledescription="diapositiva"
                        aria-label={`Diapositiva ${i + 1} de ${slides.length}: ${slide.titulo}`}
                        aria-hidden={i !== indiceActual}
                    >
                        <img src={slide.imagen} alt={slide.alt} />
                        <div className="carrusel-caption">
                            <h3>{slide.titulo}</h3>
                            <p>{slide.descripcion}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controles del carrusel */}
            <div className="carrusel-controles">
                {/* DIFERENCIA: en HTML5 usábamos addEventListener("click", irAnterior)
                    en React usamos onClick={irAnterior} directamente */}
                <button type="button" className="carrusel-boton" onClick={irAnterior} aria-label="Diapositiva anterior">
                    &#9664; Anterior
                </button>
                <span className="carrusel-indicador" aria-live="polite" aria-atomic="true">
                    {indiceActual + 1} / {slides.length}
                </span>
                <button type="button" className="carrusel-boton" onClick={irSiguiente} aria-label="Diapositiva siguiente">
                    Siguiente &#9654;
                </button>
                <button type="button" className="carrusel-pausa" onClick={toggleAutoplay} aria-label={autoplayActivo ? 'Pausar carrusel automático' : 'Reproducir carrusel automático'}>
                    {autoplayActivo ? '❚❚ Pausar' : '▶ Play'}
                </button>
            </div>
        </section>
    );
}

export default Carrusel;
