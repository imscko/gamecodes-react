// ================================
// COMPONENTE: Registro (Formulario de registro de usuarios)
// ================================
// ANTES (HTML5): registro.html + js/registro.js
// AHORA (React): Todo en un archivo .jsx con useState para cada campo

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Registro({ onRegister, listaUsuarios }) {
    // Estados controlados del formulario
    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [esExito, setEsExito] = useState(false);



    // Hash de contraseña (SHA-256) usando Web Crypto API
    async function hashPassword(pw) {
        const enc = new TextEncoder();
        const data = enc.encode(pw);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Funciones de validación (misma lógica que registro.js)
    function validarEmail(correoValor) {
        var regexEmail = /^[^\s@]+@[^\s@]{2,}\.[a-zA-Z]{2,}$/;
        return regexEmail.test(correoValor);
    }

    function validarPassword(valorPassword, valorConfirmar) {
        if (valorPassword.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        }
        var regexMayuscula = /[A-Z]/;
        if (!regexMayuscula.test(valorPassword)) {
            return 'La contraseña debe contener al menos una letra mayúscula.';
        }
        var regexEspecial = /[.,;:!?@#$%&*\-_]/;
        if (!regexEspecial.test(valorPassword)) {
            return 'La contraseña debe contener al menos un caracter especial(. , ; : ! ? @ # $ % & * - _).';
        }
        if (valorPassword !== valorConfirmar) {
            return 'Las contraseñas no coinciden.';
        }
        return null;
    }

    // REEMPLAZO de addEventListener("submit")
    const handleSubmit = async (e) => {
        e.preventDefault();

        var valorUsuario = usuario.trim();
        var valorCorreo = correo.trim();
        var valorPassword = password;
        var valorConfirmar = confirmar;

        // Validación 1: Campos vacíos
        if (valorUsuario === '' || valorCorreo === '' || valorPassword === '' || valorConfirmar === '') {
            setMensaje('Todos los campos son obligatorios.');
            setEsExito(false);
            return;
        }

        // Validación 2: Email
        if (!validarEmail(valorCorreo)) {
            setMensaje('El formato del correo electrónico no es válido.');
            setEsExito(false);
            return;
        }

        // Validación 3: Password
        var errorPassword = validarPassword(valorPassword, valorConfirmar);
        if (errorPassword !== null) {
            setMensaje(errorPassword);
            setEsExito(false);
            return;
        }

        // Validación 4: Verificar que el correo no esté registrado (usando listaUsuarios pasada por props)
        var correoExiste = Array.isArray(listaUsuarios) && listaUsuarios.some(u => u.correo === valorCorreo);

        if (correoExiste) {
            setMensaje('Este correo electrónico ya está registrado.');
            setEsExito(false);
            return;
        }


        // Crear objeto usuario; almacenar password como hash
        var datosUsuario = {
            nombre: valorUsuario,
            correo: valorCorreo,
            password: await hashPassword(valorPassword)
        };

        // Notificar al padre (App) para que gestione la lista centralizada
        if (typeof onRegister === 'function') {
            onRegister(datosUsuario);
        }

        setMensaje('Registro exitoso. ¡Bienvenido, ' + valorUsuario + '!');
        setEsExito(true);

        // Opcional: limpiar formulario
        setUsuario('');
        setCorreo('');
        setPassword('');
        setConfirmar('');

    };

    return (
        <main className="pagina-registro">
            <form className="formulario-contenedor" onSubmit={handleSubmit} noValidate>
                <h1 className="formulario-titulo">Registro de Usuario</h1>

                <label htmlFor="registro-usuario" className="formulario-label">Usuario</label>
                <input
                    id="registro-usuario"
                    type="text"
                    className="formulario-campo"
                    placeholder="Ingresa tu usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    autoComplete="username"
                />

                <label htmlFor="registro-correo" className="formulario-label">Correo Electrónico</label>
                <input
                    id="registro-correo"
                    type="email"
                    className="formulario-campo"
                    placeholder="ejemplo@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    autoComplete="email"
                />

                <label htmlFor="registro-password" className="formulario-label">Contraseña</label>
                <input
                    id="registro-password"
                    type="password"
                    className="formulario-campo"
                    placeholder="Mín. 8 chars, 1 mayúscula, 1 especial (. ,)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />
                <p className="formulario-ayuda">Requisitos: mínimo 8 caracteres, al menos 1 letra mayúscula y 1 carácter especial (. , ; : ! ? @ # $ % &amp; * - _).</p>

                <label htmlFor="registro-confirmar" className="formulario-label">Confirmar Contraseña</label>
                <input
                    id="registro-confirmar"
                    type="password"
                    className="formulario-campo"
                    placeholder="Repite tu contraseña"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                    autoComplete="new-password"
                />

                <button type="submit" className="formulario-boton">Registrarse</button>

                <p className={`formulario-mensaje ${esExito ? 'formulario-mensaje-exito' : ''}`} aria-live="assertive" role="alert">
                    {mensaje}
                </p>

                <div className="formulario-enlace-volver">
                    <Link to="/">← Volver al inicio</Link>
                </div>
            </form>
        </main>
    );
}

export default Registro;
