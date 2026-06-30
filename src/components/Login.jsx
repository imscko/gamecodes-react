// ================================
// COMPONENTE: Login (Formulario de inicio de sesión)
// ================================
// ANTES (HTML5): login.html + js/login.js con addEventListener("submit")
// AHORA (React): Todo en un solo archivo .jsx con useState para manejar los campos
//
// DIFERENCIA CLAVE:
// - HTML5: var correo = document.getElementById("correoLogin");
//          correo.value.trim();
// - React: const [correo, setCorreo] = useState("");
//          value={correo} onChange={(e) => setCorreo(e.target.value)}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// El componente recibe "onLogin" como prop del padre (App.jsx)
// onLogin es una función que App le pasa para manejar el login
function Login({ onLogin, listaUsuarios, updateUsuario }) {

    // ================================
    // useState: REEMPLAZO DE document.getElementById()
    // ================================
    // ANTES: var correo = document.getElementById("correoLogin");
    // AHORA: cada campo del formulario tiene su propio estado
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [esExito, setEsExito] = useState(false);



    async function hashPassword(pw) {
        const enc = new TextEncoder();
        const data = enc.encode(pw);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // useNavigate reemplaza a window.location.href = "index.html"
    const navigate = useNavigate();

    // Funciones de validación (misma lógica que login.js)
    function validarEmail(correoValor) {
        var regexEmail = /^[^\s@]+@[^\s@]{2,}\.[a-zA-Z]{2,}$/;
        return regexEmail.test(correoValor);
    }

    // ================================
    // handleSubmit: REEMPLAZO DE addEventListener("submit")
    // ================================
    // ANTES: formulario.addEventListener("submit", function(event) { ... });
    // AHORA: <form onSubmit={handleSubmit}>
    const handleSubmit = async (e) => {
        e.preventDefault();

        var valorCorreo = correo.trim();
        var valorPassword = password;

        // Validación 1: Campos vacíos
        if (valorCorreo === '' || valorPassword === '') {
            setMensaje('Todos los campos son obligatorios.');
            setEsExito(false);
            return;
        }

        // ================================
        // ADMIN HARDCODEADO: admin / admin
        // ================================
        if (valorCorreo === 'admin' && valorPassword === 'admin') {
            onLogin({ nombre: 'Administrador', correo: 'admin', rol: 'admin' });
            setMensaje('¡Bienvenido, Administrador! 👑');
            setEsExito(true);
            setTimeout(() => {
                navigate('/');
            }, 1500);
            return;
        }

        // Validación 2: Formato de email (solo para usuarios normales)
        if (!validarEmail(valorCorreo)) {
            setMensaje('El formato del correo electrónico no es válido.');
            setEsExito(false);
            return;
        }

        // Usar la lista de usuarios pasada por props (centralizada en App)
        if (!Array.isArray(listaUsuarios) || listaUsuarios.length === 0) {
            setMensaje('No hay usuarios registrados. Regístrate primero.');
            setEsExito(false);
            return;
        }

        // Hash del password introducido
        const hashedInput = await hashPassword(valorPassword);

        // Buscar usuario y soportar migración desde passwords en texto plano
        var usuarioEncontrado = null;
        for (var i = 0; i < listaUsuarios.length; i++) {
            const stored = listaUsuarios[i];
            if (stored.correo === valorCorreo) {
                // Si el stored.password parece un hash SHA-256 hex (64 chars), comparar hashes
                if (typeof stored.password === 'string' && stored.password.length === 64) {
                    if (stored.password === hashedInput) {
                        usuarioEncontrado = stored;
                        break;
                    }
                } else {
                    // Legacy: contraseña en texto plano — si coincide, actualizamos a hash
                    if (stored.password === valorPassword) {
                        // Migrar almacenando el hash: usamos updateUsuario prop para persistir en App
                        const migrated = { ...stored, password: hashedInput };
                        if (typeof updateUsuario === 'function') {
                            updateUsuario(migrated);
                        }
                        usuarioEncontrado = migrated;
                        break;
                    }
                }
            }
        }

        if (usuarioEncontrado) {
            // Enviar objeto completo con rol 'user'
            onLogin({ nombre: usuarioEncontrado.nombre, correo: usuarioEncontrado.correo, rol: 'user' });
            setMensaje('¡Hola! ' + usuarioEncontrado.nombre + ' - Inicio de sesión exitoso.');
            setEsExito(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } else {
            setMensaje('Correo o contraseña incorrectos.');
            setEsExito(false);
        }
    };

    return (
        <main className="pagina-registro">
            {/* DIFERENCIA: en HTML5 usábamos <form id="loginForm">,
                en React usamos onSubmit={handleSubmit} en vez de addEventListener */}
            <form className="formulario-contenedor" onSubmit={handleSubmit} noValidate>
                <h1 className="formulario-titulo">Iniciar Sesión</h1>

                {/* DIFERENCIA CLAVE en los inputs:
                    HTML5: <input type="email" id="correoLogin">
                    React: <input value={correo} onChange={(e) => setCorreo(e.target.value)}>
                    
                    value={correo} → vincula el input al estado
                    onChange → actualiza el estado cada vez que el usuario escribe */}
                <label htmlFor="login-correo" className="formulario-label">Correo Electrónico</label>
                <input
                    id="login-correo"
                    type="email"
                    className="formulario-campo"
                    placeholder="ejemplo@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    autoComplete="email"
                />

                <label htmlFor="login-password" className="formulario-label">Contraseña</label>
                <input
                    id="login-password"
                    type="password"
                    className="formulario-campo"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />

                <button type="submit" className="formulario-boton">Ingresar</button>

                {/* DIFERENCIA: en HTML5 usábamos actualizarDOM(elemento, texto, esExito)
                    en React simplemente mostramos el estado {mensaje} y la clase cambia según esExito */}
                <p className={`formulario-mensaje ${esExito ? 'formulario-mensaje-exito' : ''}`} aria-live="assertive" role="alert">
                    {mensaje}
                </p>

                <div className="formulario-enlace-volver">
                    {/* DIFERENCIA: <a href="index.html"> → <Link to="/"> */}
                    <Link to="/">← Volver al inicio</Link>
                </div>
            </form>
        </main>
    );
}

export default Login;
