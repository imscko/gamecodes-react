// ================================
// COMPONENTE: Contacto (Formulario de contacto)
// ================================
// ANTES (HTML5): contacto.html + js/contacto.js
// AHORA (React): Todo en un archivo .jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Contacto() {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [mensajeTexto, setMensajeTexto] = useState('');
    const [mensajeResultado, setMensajeResultado] = useState('');
    const [esExito, setEsExito] = useState(false);



    function validarEmail(correoValor) {
        var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(correoValor);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        var valorNombre = nombre.trim();
        var valorEmail = email.trim();
        var valorMensaje = mensajeTexto.trim();

        // Sanitizar antes de usar/mostrar


        if (valorNombre === '' || valorEmail === '' || valorMensaje === '') {
            setMensajeResultado('Todos los campos son obligatorios.');
            setEsExito(false);
            return;
        }

        if (!validarEmail(valorEmail)) {
            setMensajeResultado('El formato del correo electrónico no es válido.');
            setEsExito(false);
            return;
        }

        setMensajeResultado('Mensaje enviado correctamente. ¡Gracias!');
        setEsExito(true);
        // Limpiar formulario
        setNombre('');
        setEmail('');
        setMensajeTexto('');
    };

    return (
        <main className="pagina-registro">
            <form className="formulario-contenedor" onSubmit={handleSubmit} noValidate>
                <h1 className="formulario-titulo">Formulario de Contacto</h1>

                <label htmlFor="contacto-nombre" className="formulario-label">Nombre</label>
                <input
                    id="contacto-nombre"
                    type="text"
                    className="formulario-campo"
                    placeholder="Tu nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    autoComplete="name"
                />

                <label htmlFor="contacto-email" className="formulario-label">Correo Electrónico</label>
                <input
                    id="contacto-email"
                    type="email"
                    className="formulario-campo"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />

                <label htmlFor="contacto-mensaje" className="formulario-label">Mensaje</label>
                <textarea
                    id="contacto-mensaje"
                    className="formulario-campo formulario-textarea"
                    placeholder="Escribe tu mensaje..."
                    value={mensajeTexto}
                    onChange={(e) => setMensajeTexto(e.target.value)}
                    required
                ></textarea>
                {/* DIFERENCIA: el contador se calcula dinámicamente desde el estado
                    ANTES: mensajeTexto.addEventListener("input", actualizarContador);
                    AHORA: {mensajeTexto.length} se actualiza automáticamente */}
                <p className="formulario-contador" aria-live="polite">
                    {mensajeTexto.length} caracteres
                </p>

                <button type="submit" className="formulario-boton">Enviar Mensaje</button>

                <p className={`formulario-mensaje ${esExito ? 'formulario-mensaje-exito' : ''}`} aria-live="assertive" role="alert">
                    {mensajeResultado}
                </p>

                <div className="formulario-enlace-volver">
                    <Link to="/">← Volver al inicio</Link>
                </div>
            </form>
        </main>
    );
}

export default Contacto;
