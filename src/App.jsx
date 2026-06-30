// ================================
// COMPONENTE RAÍZ: App (Orquestador principal)
// ================================
// Este es el componente "padre" que controla toda la aplicación.
// Es equivalente a lo que antes hacían TODOS los archivos HTML + JS juntos.
//
// ESTRUCTURA DE COMUNICACIÓN EN REACT:
//
//   App.jsx (padre)
//     ├── Header.jsx    ← recibe props: usuario, onLogout, totalCarrito
//     ├── Bienvenida.jsx ← recibe prop: usuario (objeto con rol)
//     ├── Banner.jsx     ← no necesita props (tiene su propio estado interno)
//     │   └── Carrusel.jsx ← hijo de Banner (tiene useState para el índice)
//     ├── Trucos.jsx     ← no necesita props (datos internos)
//     ├── SobreMi.jsx    ← no necesita props (contenido estático)
//     ├── Redes.jsx      ← no necesita props (contenido estático)
//     ├── Footer.jsx     ← no necesita props (contenido estático)
//     ├── Login.jsx      ← recibe prop: onLogin (función para guardar sesión)
//     ├── Registro.jsx   ← no necesita props (guarda directo en localStorage)
//     ├── Contacto.jsx   ← no necesita props (formulario independiente)
//     ├── Tienda.jsx     ← recibe props: productos, agregarAlCarrito
//     ├── Carrito.jsx    ← recibe props: carrito, productos, funciones carrito
//     └── AdminPanel.jsx ← recibe props: usuario, productos, funciones admin
//
// FLUJO DE DATOS (Props):
// 1. App tiene el estado "usuario" (useState)
// 2. App pasa "usuario" como prop a Header y Bienvenida
// 3. App pasa "onLogin" como prop a Login (para que Login pueda actualizar el estado)
// 4. App pasa "onLogout" como prop a Header (para que el botón pueda cerrar sesión)
//
// Esto es el "FLUJO UNIDIRECCIONAL DE DATOS" de React:
// Los datos BAJAN del padre a los hijos (via props)
// Las acciones SUBEN de los hijos al padre (via funciones callback)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Sonidos interactivos (Web Audio API)
import { sonidoBienvenida, sonidoDespedida } from './utils/sonidos.jsx';

// Importar todos los componentes
import Header from './components/Header.jsx';
import Bienvenida from './components/Bienvenida.jsx';
import Banner from './components/Banner.jsx';
import Trucos from './components/Trucos.jsx';
import SobreMi from './components/SobreMi.jsx';
import Redes from './components/Redes.jsx';
import Footer from './components/Footer.jsx';
import Login from './components/Login.jsx';
import Registro from './components/Registro.jsx';
import Contacto from './components/Contacto.jsx';
import Tienda from './components/Tienda.jsx';
import Carrito from './components/Carrito.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { juegosIniciales } from './utils/juegosIniciales.js';

function App() {

    // ================================
    // ESTADO GLOBAL DE LA SESIÓN
    // ================================
    // El usuario ahora es un OBJETO: { nombre, correo, rol }
    // rol puede ser 'admin' o 'user'
    const [usuario, setUsuario] = useState(() => {
        try {
            const guardado = localStorage.getItem('usuarioLogueado');
            if (!guardado) return null;
            // Soportar migración: si es string antiguo, convertir a objeto
            const parsed = JSON.parse(guardado);
            if (typeof parsed === 'string') return { nombre: parsed, correo: '', rol: 'user' };
            return parsed;
        } catch (e) {
            // Si no es JSON (string antiguo), migrar
            const nombre = localStorage.getItem('usuarioLogueado');
            if (nombre) return { nombre, correo: '', rol: 'user' };
            return null;
        }
    });

    // Estado para mostrar el popup de sesión cerrada
    const [mostrarPopup, setMostrarPopup] = useState(false);

    // Estado para activar/desactivar sonidos (persistido en localStorage)
    const [sonidoActivo, setSonidoActivo] = useState(() => {
        const guardado = localStorage.getItem('sonidoActivo');
        return guardado !== null ? JSON.parse(guardado) : true;
    });

    // ================================
    // ACCESIBILIDAD: Preferencias Triple-AAA (alto contraste, texto grande, fuente legible)
    // ================================
    const [accessibility, setAccessibility] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('accessibility')) || { highContrast: false, largeText: false, dyslexicFont: false, ttsEnabled: false };
        } catch (e) {
            return { highContrast: false, largeText: false, dyslexicFont: false, ttsEnabled: false };
        }
    });

    const [showAccPanel, setShowAccPanel] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('accessibility', JSON.stringify(accessibility));
        } catch (e) {
            console.error('No se pudo guardar accessibility en localStorage', e);
        }
    }, [accessibility]);

    // Toggle individual accessibility option
    const toggleAccOption = (key) => {
        setAccessibility((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            // Si se está activando TTS, desbloquear speechSynthesis desde el click del usuario
            if (key === 'ttsEnabled' && next.ttsEnabled && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const unlock = new SpeechSynthesisUtterance('');
                unlock.volume = 0;
                unlock.lang = 'es-ES';
                window.speechSynthesis.speak(unlock);
                ttsUnlockedRef.current = true;
            }
            return next;
        });
    };

    // ================================
    // TEXT-TO-SPEECH: Leer con el mouse
    // ================================
    const ttsTimeoutRef = useRef(null);
    const ttsCurrentElRef = useRef(null);
    const ttsUnlockedRef = useRef(false);

    // Función para obtener el texto más relevante de un elemento
    const getElementText = useCallback((el) => {
        // Priorizar atributos de accesibilidad
        if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
        if (el.getAttribute('alt')) return el.getAttribute('alt');
        if (el.getAttribute('title')) return el.getAttribute('title');
        if (el.getAttribute('placeholder')) return el.getAttribute('placeholder');
        // Para inputs, leer el valor o el label asociado
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            const label = el.closest('label');
            if (label) return label.textContent.trim();
            return el.getAttribute('placeholder') || el.value || '';
        }
        // Para el texto directo del elemento (sin incluir hijos profundos innecesarios)
        const directText = Array.from(el.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent.trim())
            .join(' ');
        if (directText.length > 2) return directText;
        // Fallback al innerText completo (limitado)
        const full = (el.innerText || el.textContent || '').trim();
        return full.length > 200 ? full.substring(0, 200) + '...' : full;
    }, []);

    // Función auxiliar para hablar texto de forma segura
    // Configurado con pitch bajo y rate lento para emular el estilo "Loquendo" clásico
    const speakText = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        // Pitch bajo y rate lento = tono robótico grave estilo Loquendo
        utterance.rate = 0.85;
        utterance.pitch = 0.65;
        utterance.volume = 1;

        // Buscar la voz más parecida a Loquendo (voz masculina española robótica)
        const voices = window.speechSynthesis.getVoices();
        // Prioridad: voces masculinas en español que suenan más robóticas
        const preferred = [
            'Microsoft Pablo',    // Windows - voz masculina ES robótica
            'Microsoft Raúl',     // Windows - otra voz masculina ES
            'Jorge',              // macOS - voz masculina ES
            'Diego',              // Otra opción masculina
        ];
        let selectedVoice = null;
        // Primero buscar voces preferidas
        for (const name of preferred) {
            selectedVoice = voices.find(v => v.name.includes(name));
            if (selectedVoice) break;
        }
        // Si no encontró preferidas, buscar cualquier voz masculina en español
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('es') && !v.name.toLowerCase().includes('female'));
        }
        // Fallback a cualquier voz en español
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('es'));
        }
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
            if (ttsCurrentElRef.current) {
                ttsCurrentElRef.current.classList.remove('tts-highlight');
            }
        };
        window.speechSynthesis.speak(utterance);
    }, []);

    useEffect(() => {
        if (!accessibility.ttsEnabled) {
            // Limpiar al desactivar
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (ttsCurrentElRef.current) {
                ttsCurrentElRef.current.classList.remove('tts-highlight');
                ttsCurrentElRef.current = null;
            }
            return;
        }

        // Fallback: si TTS se activa desde localStorage (recarga de página),
        // necesitamos un click en cualquier lugar para desbloquear speech
        const unlockOnClick = () => {
            if (!ttsUnlockedRef.current && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const unlock = new SpeechSynthesisUtterance('Lectura con mouse activada');
                unlock.lang = 'es-ES';
                unlock.volume = 1;
                unlock.rate = 1;
                window.speechSynthesis.speak(unlock);
                ttsUnlockedRef.current = true;
            }
            document.removeEventListener('click', unlockOnClick, true);
        };

        if (!ttsUnlockedRef.current) {
            document.addEventListener('click', unlockOnClick, true);
        }

        const handleMouseOver = (e) => {
            const target = e.target;
            // Ignorar elementos sin texto o el propio contenedor root
            if (!target || target === document.body || target === document.documentElement) return;
            // Ignorar el propio panel de accesibilidad para no interferir
            if (target.closest('.panel-accesibilidad') || target.closest('.boton-accesibilidad')) return;
            // Si es el mismo elemento, no repetir
            if (target === ttsCurrentElRef.current) return;

            // Limpiar timeout anterior
            if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);

            // Debounce de 150ms (más rápido para mejor experiencia)
            ttsTimeoutRef.current = setTimeout(() => {
                const text = getElementText(target);
                if (!text || text.length < 2) return;

                // Quitar highlight anterior
                if (ttsCurrentElRef.current) {
                    ttsCurrentElRef.current.classList.remove('tts-highlight');
                }

                // Agregar highlight al nuevo elemento
                target.classList.add('tts-highlight');
                ttsCurrentElRef.current = target;

                // Hablar el texto
                speakText(text);
            }, 150);
        };

        const handleMouseOut = (e) => {
            const target = e.target;
            if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);
            if (target) target.classList.remove('tts-highlight');
            if (ttsCurrentElRef.current === target) {
                ttsCurrentElRef.current = null;
            }
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };

        document.addEventListener('mouseover', handleMouseOver, true);
        document.addEventListener('mouseout', handleMouseOut, true);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver, true);
            document.removeEventListener('mouseout', handleMouseOut, true);
            document.removeEventListener('click', unlockOnClick, true);
            if (ttsTimeoutRef.current) clearTimeout(ttsTimeoutRef.current);
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (ttsCurrentElRef.current) {
                ttsCurrentElRef.current.classList.remove('tts-highlight');
                ttsCurrentElRef.current = null;
            }
        };
    }, [accessibility.ttsEnabled, getElementText, speakText]);

    // ================================
    // LISTA DE USUARIOS (estado centralizado)
    // ================================
    const [listaUsuarios, setListaUsuarios] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('listaUsuarios')) || [];
        } catch (e) {
            return [];
        }
    });

    // Sincronizar listaUsuarios con localStorage
    useEffect(() => {
        try {
            localStorage.setItem('listaUsuarios', JSON.stringify(listaUsuarios));
        } catch (e) {
            console.error('No se pudo guardar listaUsuarios en localStorage', e);
        }
    }, [listaUsuarios]);

    // Handler para registrar un usuario (se pasa a `Registro`)
    const handleRegister = (nuevoUsuario) => {
        setListaUsuarios((prev) => [...prev, nuevoUsuario]);
    };

    // Handler para actualizar un usuario existente (se pasa a `Login` para migraciones)
    const updateUsuario = (usuarioActualizado) => {
        setListaUsuarios((prev) => prev.map(u => (u.correo === usuarioActualizado.correo ? usuarioActualizado : u)));
    };

    // ================================
    // PRODUCTOS DE LA TIENDA (datos de RAWG + precio CLP)
    // ================================
    const [productos, setProductos] = useState(() => {
        try {
            const guardado = JSON.parse(localStorage.getItem('productosPublicados'));
            if (guardado && guardado.length > 0) return guardado;
            return juegosIniciales;
        } catch (e) {
            return juegosIniciales;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('productosPublicados', JSON.stringify(productos));
        } catch (e) {
            console.error('No se pudo guardar productos en localStorage', e);
        }
    }, [productos]);

    // Funciones de gestión de productos (admin)
    const publicarProducto = (producto) => {
        setProductos((prev) => [...prev, producto]);
    };

    const editarPrecioProducto = (productoId, nuevoPrecio) => {
        setProductos((prev) => prev.map(p => p.id === productoId ? { ...p, precioCLP: nuevoPrecio } : p));
    };

    const eliminarProducto = (productoId) => {
        setProductos((prev) => prev.filter(p => p.id !== productoId));
        // También eliminar del carrito si estaba ahí
        setCarrito((prev) => prev.filter(item => item.productoId !== productoId));
    };

    // ================================
    // CARRITO DE COMPRAS
    // ================================
    const [carrito, setCarrito] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('carritoCompras')) || [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('carritoCompras', JSON.stringify(carrito));
        } catch (e) {
            console.error('No se pudo guardar carrito en localStorage', e);
        }
    }, [carrito]);

    // Funciones del carrito
    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            const existe = prev.find(item => item.productoId === producto.id);
            if (existe) {
                return prev.map(item => item.productoId === producto.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
                );
            }
            return [...prev, { productoId: producto.id, cantidad: 1 }];
        });
    };

    const actualizarCantidadCarrito = (productoId, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            setCarrito((prev) => prev.filter(item => item.productoId !== productoId));
        } else {
            setCarrito((prev) => prev.map(item =>
                item.productoId === productoId ? { ...item, cantidad: nuevaCantidad } : item
            ));
        }
    };

    const quitarDelCarrito = (productoId) => {
        setCarrito((prev) => prev.filter(item => item.productoId !== productoId));
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    // Total de items en el carrito (para el badge del Header)
    const totalItemsCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    // Guardar preferencia de sonido en localStorage
    useEffect(() => {
        localStorage.setItem('sonidoActivo', JSON.stringify(sonidoActivo));
    }, [sonidoActivo]);

    // ================================
    // useEffect: SINCRONIZAR SESIÓN CON localStorage
    // ================================
    useEffect(() => {
        if (usuario) {
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
        } else {
            localStorage.removeItem('usuarioLogueado');
        }
    }, [usuario]);

    // ================================
    // FUNCIONES QUE SE PASAN COMO PROPS
    // ================================
    // Estas funciones se pasan a los componentes hijos para que
    // puedan "subir" datos al padre (App)

    // Login.jsx llama a onLogin(datosUsuario) cuando el login es exitoso
    // datosUsuario es un objeto: { nombre, correo, rol }
    const handleLogin = (datosUsuario) => {
        setUsuario(datosUsuario);
        if (sonidoActivo) sonidoBienvenida();
    };

    // Header.jsx llama a onLogout() cuando el usuario hace clic en "Cerrar Sesión"
    const handleLogout = (e) => {
        e.preventDefault();
        setUsuario(null);
        setMostrarPopup(true);
        if (sonidoActivo) sonidoDespedida();
        // Ocultar el popup después de 2.5 segundos
        setTimeout(() => {
            setMostrarPopup(false);
        }, 2500);
    };

    // ================================
    // COMPONENTE "Inicio": La página principal con todas las secciones
    // ================================
    // Este es un componente interno que agrupa las secciones de la página principal
    // Se usa como ruta "/" en React Router
    function Inicio() {
        return (
            <main id="contenido-principal">
                <Banner />
                <Trucos />
                <SobreMi />
                <Redes />
            </main>
        );
    }

    // ================================
    // JSX DEL APP (RENDERIZADO)
    // ================================
    return (
        // BrowserRouter envuelve toda la app para habilitar la navegación
        // ANTES: cada página era un archivo .html separado
        // AHORA: React Router muestra/oculta componentes según la URL
        <BrowserRouter>
            <div className={`app-root ${accessibility.highContrast ? 'acc-high-contrast' : ''} ${accessibility.largeText ? 'acc-large-text' : ''} ${accessibility.dyslexicFont ? 'acc-dyslexic-font' : ''} ${accessibility.ttsEnabled ? 'acc-tts-active' : ''}`}>
            {/* Skip navigation link para accesibilidad */}
            <a href="#contenido-principal" className="skip-link">Saltar al contenido principal</a>

            {/* Header siempre visible, recibe usuario, logout, y total carrito */}
            <Header usuario={usuario} onLogout={handleLogout} totalCarrito={totalItemsCarrito} />

            {/* Barra de bienvenida (solo se muestra si hay usuario) */}
            <Bienvenida usuario={usuario} />

            {/* ================================
                RUTAS
                ================================ */}
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/login" element={<Login onLogin={handleLogin} listaUsuarios={listaUsuarios} updateUsuario={updateUsuario} />} />
                <Route path="/registro" element={<Registro onRegister={handleRegister} listaUsuarios={listaUsuarios} />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/tienda" element={
                    <Tienda productos={productos} agregarAlCarrito={agregarAlCarrito} usuario={usuario} />
                } />
                <Route path="/carrito" element={
                    <Carrito
                        carrito={carrito}
                        productos={productos}
                        actualizarCantidad={actualizarCantidadCarrito}
                        quitarDelCarrito={quitarDelCarrito}
                        vaciarCarrito={vaciarCarrito}
                    />
                } />
                <Route path="/admin" element={
                    <AdminPanel
                        usuario={usuario}
                        productos={productos}
                        onPublicar={publicarProducto}
                        onEditarPrecio={editarPrecioProducto}
                        onEliminar={eliminarProducto}
                    />
                } />
            </Routes>

            {/* Footer siempre visible */}
            <Footer />

            {/* Botón y panel de accesibilidad Triple-AAA */}
            <div className="accesibilidad-container">
                <button
                    className="boton-accesibilidad"
                    onClick={() => setShowAccPanel(!showAccPanel)}
                    aria-expanded={showAccPanel}
                    aria-controls="panel-accesibilidad"
                    aria-label="Opciones de accesibilidad"
                    title="Opciones de accesibilidad"
                >
                    ♿ AAA
                </button>

                {showAccPanel && (
                    <div id="panel-accesibilidad" className="panel-accesibilidad" role="dialog" aria-label="Opciones de accesibilidad">
                        <h3>Accesibilidad</h3>
                        <div className="acc-option">
                            <label>
                                <input type="checkbox" checked={accessibility.highContrast} onChange={() => toggleAccOption('highContrast')} />
                                Alto contraste
                            </label>
                        </div>
                        <div className="acc-option">
                            <label>
                                <input type="checkbox" checked={accessibility.largeText} onChange={() => toggleAccOption('largeText')} />
                                Texto grande
                            </label>
                        </div>
                        <div className="acc-option">
                            <label>
                                <input type="checkbox" checked={accessibility.dyslexicFont} onChange={() => toggleAccOption('dyslexicFont')} />
                                Fuente legible (dislexia)
                            </label>
                        </div>
                        <div className="acc-option">
                            <label>
                                <input type="checkbox" checked={accessibility.ttsEnabled} onChange={() => toggleAccOption('ttsEnabled')} />
                                🔊 Leer con el mouse
                            </label>
                        </div>
                        <div className="acc-actions">
                            <button type="button" onClick={() => { setAccessibility({ highContrast: false, largeText: false, dyslexicFont: false, ttsEnabled: false }); }}>
                                Restablecer
                            </button>
                            <button type="button" onClick={() => setShowAccPanel(false)}>Cerrar</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Botón flotante para activar/desactivar sonidos */}
            <button
                className={`boton-sonido ${sonidoActivo ? 'activo' : 'inactivo'}`}
                onClick={() => setSonidoActivo(!sonidoActivo)}
                aria-label={sonidoActivo ? 'Desactivar sonidos' : 'Activar sonidos'}
                title={sonidoActivo ? 'Sonidos activados' : 'Sonidos desactivados'}
            >
                {sonidoActivo ? '🔊' : '🔇'}
            </button>

            {/* Popup de sesión cerrada */}
            {mostrarPopup && (
                <div className="popup-overlay" onClick={() => setMostrarPopup(false)}>
                    <div className="popup-contenido" onClick={(e) => e.stopPropagation()}>
                        <span className="popup-icono">✅</span>
                        <p className="popup-mensaje">Sesión Cerrada con éxito</p>
                    </div>
                </div>
            )}
            </div>
        </BrowserRouter>
    );
}

export default App;
