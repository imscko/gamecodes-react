// ================================
// COMPONENTE: Footer (Pie de página)
// ================================

import React from 'react';

function Footer() {
    return (
        <footer role="contentinfo">
            <div className="footer-info-academica">
                <div className="footer-info-item">
                    <span className="footer-info-label">Nombre Alumno</span>
                    <span className="footer-info-valor">Iván Alonso Maldonado Aravena</span>
                </div>
                <div className="footer-info-item">
                    <span className="footer-info-label">Nombre Profesor</span>
                    <span className="footer-info-valor">Victor Armando Vásquez Muñoz</span>
                </div>
                <div className="footer-info-item">
                    <span className="footer-info-label">Asignatura</span>
                    <span className="footer-info-valor">Programación Front End</span>
                </div>
                <div className="footer-info-item">
                    <span className="footer-info-label">Sección</span>
                    <span className="footer-info-valor">IEI-N3-P2-C2</span>
                </div>
            </div>
            <p>&copy; 2026 GameCodes - Iván | Todos los derechos reservados a mi mismo</p>
            <p>Proyecto de evaluación - Diseño Web</p>
        </footer>
    );
}

export default Footer;
