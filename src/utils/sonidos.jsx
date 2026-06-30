// ================================
// UTILIDAD: Sonidos interactivos con Web Audio API
// ================================
// Genera sonidos sintéticos sin necesidad de archivos de audio.
// Se usa la Web Audio API nativa del navegador.

const AudioContext = window.AudioContext || window.webkitAudioContext;

/**
 * Reproduce un sonido de bienvenida (login exitoso).
 * Acordes ascendentes alegres estilo "power up" de videojuego.
 */
export function sonidoBienvenida() {
    try {
        const ctx = new AudioContext();

        const notas = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const duracionNota = 0.15;

        notas.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, ctx.currentTime + i * duracionNota);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * duracionNota + 0.02);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * duracionNota + duracionNota * 0.8);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * duracionNota + duracionNota);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + i * duracionNota);
            osc.stop(ctx.currentTime + i * duracionNota + duracionNota);
        });

        // Nota final larga y brillante
        const oscFinal = ctx.createOscillator();
        const gainFinal = ctx.createGain();
        oscFinal.type = 'sine';
        oscFinal.frequency.value = 1046.50; // C6
        gainFinal.gain.setValueAtTime(0, ctx.currentTime + notas.length * duracionNota);
        gainFinal.gain.linearRampToValueAtTime(0.12, ctx.currentTime + notas.length * duracionNota + 0.05);
        gainFinal.gain.linearRampToValueAtTime(0, ctx.currentTime + notas.length * duracionNota + 0.5);
        oscFinal.connect(gainFinal);
        gainFinal.connect(ctx.destination);
        oscFinal.start(ctx.currentTime + notas.length * duracionNota);
        oscFinal.stop(ctx.currentTime + notas.length * duracionNota + 0.5);

        // Cerrar contexto después de que termine
        setTimeout(() => ctx.close(), 2000);
    } catch (e) {
        console.warn('No se pudo reproducir el sonido de bienvenida:', e);
    }
}

/**
 * Reproduce un sonido de despedida (cierre de sesión).
 * Acordes descendentes suaves estilo "power down".
 */
export function sonidoDespedida() {
    try {
        const ctx = new AudioContext();

        const notas = [783.99, 659.25, 523.25, 392.00]; // G5, E5, C5, G4
        const duracionNota = 0.18;

        notas.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, ctx.currentTime + i * duracionNota);
            gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * duracionNota + 0.02);
            gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * duracionNota + duracionNota * 0.7);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * duracionNota + duracionNota);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + i * duracionNota);
            osc.stop(ctx.currentTime + i * duracionNota + duracionNota);
        });

        // Nota final grave y larga
        const oscFinal = ctx.createOscillator();
        const gainFinal = ctx.createGain();
        oscFinal.type = 'sine';
        oscFinal.frequency.value = 261.63; // C4
        gainFinal.gain.setValueAtTime(0, ctx.currentTime + notas.length * duracionNota);
        gainFinal.gain.linearRampToValueAtTime(0.1, ctx.currentTime + notas.length * duracionNota + 0.05);
        gainFinal.gain.linearRampToValueAtTime(0, ctx.currentTime + notas.length * duracionNota + 0.6);
        oscFinal.connect(gainFinal);
        gainFinal.connect(ctx.destination);
        oscFinal.start(ctx.currentTime + notas.length * duracionNota);
        oscFinal.stop(ctx.currentTime + notas.length * duracionNota + 0.6);

        // Cerrar contexto después de que termine
        setTimeout(() => ctx.close(), 2000);
    } catch (e) {
        console.warn('No se pudo reproducir el sonido de despedida:', e);
    }
}
