// ================================
// PUNTO DE ENTRADA DE LA APLICACIÓN REACT
// ================================
// Este archivo es equivalente a lo que antes hacían los <script> en cada .html
// React toma el <div id="root"> del index.html y monta toda la app ahí.
//
// DIFERENCIA CON HTML5:
// Antes: el navegador cargaba index.html, login.html, etc. por separado
// Ahora: React carga UNA sola vez y cambia los componentes dinámicamente

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// createRoot() toma el div#root del index.html
// y le dice a React: "tú controlas todo lo que se renderiza aquí"
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
